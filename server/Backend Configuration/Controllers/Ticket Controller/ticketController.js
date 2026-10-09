const Ticket = require("../../Models/TicketSchema/ticket");
const Booking = require("../../Models/BookingSchema/booking");
const Event = require("../../Models/EventSchema/event");
const ActivityLog = require("../../Models/ActivityLogSchema/activityLog");
const QRCode = require("qrcode");

// GET TICKETS BY BOOKING ID
const getTicketsByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Check permission (owner or organizer of the event or admin)
        const event = await Event.findById(booking.event);
        const isOwner = booking.attendee.toString() === req.user._id.toString();
        const isOrganizer = event && event.organizer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isOrganizer && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const tickets = await Ticket.find({ booking: bookingId })
            .populate("event", "title date startTime endTime venue location image")
            .populate("attendee", "name email phone");

        res.status(200).json({
            success: true,
            count: tickets.length,
            tickets
        });
    } catch (error) {
        console.error("Get tickets error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load tickets"
        });
    }
};

// VERIFY TICKET (Gate Scanner Lookup)
const verifyTicket = async (req, res) => {
    try {
        const { ticketCode } = req.body;

        if (!ticketCode) {
            return res.status(400).json({
                success: false,
                message: "Ticket code is required"
            });
        }

        const ticket = await Ticket.findOne({ ticketCode: ticketCode.trim() })
            .populate("event")
            .populate("attendee", "name email phone")
            .populate("booking");

        if (!ticket) {
            return res.status(404).json({
                success: false,
                isValid: false,
                status: "invalid",
                message: "Invalid Ticket: No record found with this code"
            });
        }

        // Check if organizer owns this event or is admin
        if (
            req.user.role !== "admin" &&
            ticket.event.organizer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                isValid: false,
                status: "unauthorized",
                message: "You are not authorized to verify tickets for this event"
            });
        }

        if (ticket.status === "cancelled") {
            return res.status(200).json({
                success: true,
                isValid: false,
                status: "cancelled",
                message: "Ticket has been cancelled and cannot be used",
                ticket
            });
        }

        if (ticket.status === "used") {
            return res.status(200).json({
                success: true,
                isValid: false,
                status: "already_used",
                message: `Ticket already used / checked in at ${new Date(ticket.checkedInAt).toLocaleTimeString()}`,
                ticket
            });
        }

        // Valid Active Ticket
        res.status(200).json({
            success: true,
            isValid: true,
            status: "active",
            message: "Ticket is VALID. Ready for check-in.",
            ticket
        });
    } catch (error) {
        console.error("Verify ticket error:", error);
        res.status(500).json({
            success: false,
            message: "Error verifying ticket"
        });
    }
};

// CHECK-IN ATTENDEE (Mark ticket as used)
const checkInTicket = async (req, res) => {
    try {
        const { ticketCode } = req.body;

        if (!ticketCode) {
            return res.status(400).json({
                success: false,
                message: "Ticket code is required"
            });
        }

        const ticket = await Ticket.findOne({ ticketCode: ticketCode.trim() })
            .populate("event")
            .populate("attendee", "name email phone");

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Authorization check
        if (
            req.user.role !== "admin" &&
            ticket.event.organizer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to check in tickets for this event"
            });
        }

        if (ticket.status === "used") {
            return res.status(400).json({
                success: false,
                message: `Already checked in at ${new Date(ticket.checkedInAt).toLocaleString()}`
            });
        }

        if (ticket.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cannot check in a cancelled ticket"
            });
        }

        ticket.status = "used";
        ticket.checkedInAt = new Date();
        ticket.checkedInBy = req.user._id;

        await ticket.save();

        // Audit Log
        await ActivityLog.create({
            user: req.user._id,
            action: "TICKET_CHECKIN",
            category: "ticket",
            details: `Ticket ${ticket.ticketCode} checked in by ${req.user.name} for event ${ticket.event.title}`,
            metadata: {
                ticketId: ticket._id,
                eventId: ticket.event._id,
                attendeeId: ticket.attendee._id
            }
        });

        res.status(200).json({
            success: true,
            message: "Attendee checked in successfully!",
            ticket
        });
    } catch (error) {
        console.error("Check-in error:", error);
        res.status(500).json({
            success: false,
            message: "Check-in failed"
        });
    }
};

// GET EVENT ATTENDEES (Roster for organizers)
const getEventAttendees = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (
            req.user.role !== "admin" &&
            event.organizer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const tickets = await Ticket.find({ event: eventId })
            .populate("attendee", "name email phone")
            .populate("booking", "bookingReference createdAt")
            .sort({ createdAt: -1 });

        const totalTickets = tickets.length;
        const checkedInCount = tickets.filter(t => t.status === "used").length;
        const activeCount = tickets.filter(t => t.status === "active").length;

        res.status(200).json({
            success: true,
            event: {
                _id: event._id,
                title: event.title,
                date: event.date,
                venue: event.venue
            },
            stats: {
                totalTickets,
                checkedInCount,
                activeCount
            },
            attendees: tickets
        });
    } catch (error) {
        console.error("Get event attendees error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load attendees"
        });
    }
};

module.exports = {
    getTicketsByBooking,
    verifyTicket,
    checkInTicket,
    getEventAttendees
};
