const Booking = require("../../Models/BookingSchema/booking");
const Event = require("../../Models/EventSchema/event");
const Ticket = require("../../Models/TicketSchema/ticket");
const Payment = require("../../Models/PaymentSchema/payment");
const ActivityLog = require("../../Models/ActivityLogSchema/activityLog");
const QRCode = require("qrcode");
const { createOrder, verifySignature, keyId } = require("../../Configuration Folders/Razorpay Configuration/razorpayConfig");

// 1. CREATE RAZORPAY ORDER (Initiates Razorpay checkout)
const createRazorpayOrder = async (req, res) => {
    try {
        const { eventId, ticketTypeId, quantity } = req.body;

        if (!eventId || !ticketTypeId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "eventId, ticketTypeId and quantity are required"
            });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const ticketType = event.ticketTypes.id(ticketTypeId);
        if (!ticketType) {
            return res.status(404).json({ success: false, message: "Ticket type not found" });
        }

        const qty = Number(quantity);
        const availableTickets = ticketType.capacity - ticketType.sold;
        if (qty > availableTickets) {
            return res.status(400).json({
                success: false,
                message: `Only ${availableTickets} tickets are available`
            });
        }

        const subtotal = ticketType.price * qty;
        const fee = Math.round(subtotal * 0.035);
        const totalAmount = subtotal + fee;
        const receipt = "RCP-" + Date.now().toString(36).toUpperCase();

        const orderData = await createOrder(totalAmount, receipt);

        return res.status(200).json({
            success: true,
            order: orderData,
            totalAmount,
            keyId: orderData.keyId
        });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create Razorpay order"
        });
    }
};

// 2. CREATE BOOKING (Handles both Razorpay and Direct Payment)
const createBooking = async (req, res) => {
    try {
        const {
            eventId,
            ticketTypeId,
            quantity,
            paymentMethod = "razorpay",
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;

        if (!eventId || !ticketTypeId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "eventId, ticketTypeId and quantity are required"
            });
        }

        const qty = Number(quantity);
        if (isNaN(qty) || qty < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (event.status !== "published") {
            return res.status(400).json({
                success: false,
                message: "This event is currently not open for bookings"
            });
        }

        const ticketType = event.ticketTypes.id(ticketTypeId);

        if (!ticketType) {
            return res.status(404).json({
                success: false,
                message: "Ticket type not found"
            });
        }

        const availableTickets = ticketType.capacity - ticketType.sold;

        if (qty > availableTickets) {
            return res.status(400).json({
                success: false,
                message: `Only ${availableTickets} tickets are available`
            });
        }

        // Verify Razorpay signature only when live Razorpay gateway is used
        if (paymentMethod === "razorpay" && razorpay_payment_id && razorpay_order_id && razorpay_signature) {
            const isSignatureValid = verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
            if (!isSignatureValid) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Razorpay payment signature verification failed"
                });
            }
        }

        const subtotal = ticketType.price * qty;
        const fee = Math.round(subtotal * 0.035);
        const totalAmount = subtotal + fee;

        const bookingReference =
            "BK-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);

        // 1. Create Booking Record
        const booking = await Booking.create({
            attendee: req.user._id,
            event: eventId,
            ticketTypeId: ticketTypeId,
            ticketTypeName: ticketType.name,
            quantity: qty,
            unitPrice: ticketType.price,
            totalAmount: totalAmount,
            bookingReference: bookingReference,
            status: "confirmed"
        });

        // 2. Increment Event Sold Tickets
        ticketType.sold += qty;
        await event.save();

        // 3. Create Individual Tickets with unique codes and QR codes
        const createdTickets = [];
        for (let i = 0; i < qty; i++) {
            const ticketCode = `TKT-${bookingReference}-${i + 1}-${Math.floor(100 + Math.random() * 900)}`;

            const qrDataUrl = await QRCode.toDataURL(ticketCode, {
                width: 300,
                margin: 2,
                color: {
                    dark: "#1e1b4b",
                    light: "#ffffff"
                }
            });

            const ticket = await Ticket.create({
                booking: booking._id,
                attendee: req.user._id,
                event: event._id,
                ticketTypeId: ticketTypeId,
                ticketTypeName: ticketType.name,
                unitPrice: ticketType.price,
                ticketCode: ticketCode,
                qrCode: qrDataUrl,
                status: "active"
            });

            createdTickets.push(ticket);
        }

        // 4. Create Payment Record
        const transactionId = razorpay_payment_id || ("TXN-" + Date.now() + "-" + Math.floor(10000 + Math.random() * 90000));
        const payment = await Payment.create({
            booking: booking._id,
            user: req.user._id,
            amount: totalAmount,
            currency: "INR",
            paymentMethod: razorpay_payment_id ? "razorpay" : paymentMethod,
            paymentStatus: "completed",
            transactionId: transactionId,
            paymentDetails: {
                razorpay_payment_id: razorpay_payment_id || null,
                razorpay_order_id: razorpay_order_id || null,
                timestamp: new Date()
            }
        });

        // 5. Activity Log
        await ActivityLog.create({
            user: req.user._id,
            action: "BOOKING_CREATED",
            category: "booking",
            details: `Booked ${qty} tickets for "${event.title}" (Ref: ${bookingReference}) via ${razorpay_payment_id ? "Razorpay" : paymentMethod.toUpperCase()}`,
            metadata: {
                bookingId: booking._id,
                eventId: event._id,
                totalAmount,
                transactionId
            }
        });

        res.status(201).json({
            success: true,
            message: "Tickets booked and QR passes generated successfully!",
            booking,
            tickets: createdTickets,
            payment
        });

    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create booking"
        });
    }
};

// GET MY BOOKINGS
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            attendee: req.user._id
        })
            .populate("event")
            .sort({ createdAt: -1 });

        // Also fetch tickets for each booking
        const bookingIds = bookings.map(b => b._id);
        const allTickets = await Ticket.find({ booking: { $in: bookingIds } });

        const bookingsWithTickets = bookings.map(b => {
            const bObj = b.toObject();
            bObj.tickets = allTickets.filter(t => t.booking.toString() === b._id.toString());
            return bObj;
        });

        res.status(200).json({
            success: true,
            count: bookingsWithTickets.length,
            bookings: bookingsWithTickets
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to load bookings"
        });
    }
};

// GET SINGLE BOOKING BY ID
const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("event")
            .populate("attendee", "name email phone");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        const isOwner = booking.attendee._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";
        const isOrganizer = booking.event && booking.event.organizer?.toString() === req.user._id.toString();

        if (!isOwner && !isAdmin && !isOrganizer) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const tickets = await Ticket.find({ booking: booking._id });
        const payment = await Payment.findOne({ booking: booking._id });

        res.status(200).json({
            success: true,
            booking,
            tickets,
            payment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// CANCEL BOOKING
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Ownership or Admin check
        if (
            booking.attendee.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this booking"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        const event = await Event.findById(booking.event);

        if (event) {
            const ticketType = event.ticketTypes.id(booking.ticketTypeId);
            if (ticketType) {
                ticketType.sold = Math.max(0, ticketType.sold - booking.quantity);
                await event.save();
            }
        }

        // Cancel associated tickets
        await Ticket.updateMany(
            { booking: booking._id },
            { status: "cancelled" }
        );

        // Cancel payment if exists
        await Payment.updateMany(
            { booking: booking._id },
            { paymentStatus: "refunded" }
        );

        booking.status = "cancelled";
        await booking.save();

        // Audit Log
        await ActivityLog.create({
            user: req.user._id,
            action: "BOOKING_CANCELLED",
            category: "booking",
            details: `Cancelled booking ${booking.bookingReference}`,
            metadata: {
                bookingId: booking._id,
                eventId: booking.event
            }
        });

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully and refund processed",
            booking
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL BOOKINGS - ADMIN
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("attendee", "name email phone")
            .populate("event", "title venue location date")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get all bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load bookings"
        });
    }
};

// GET ORGANIZER BOOKINGS
const getOrganizerBookings = async (req, res) => {
    try {
        const events = await Event.find({
            organizer: req.user._id
        }).select("_id");

        const eventIds = events.map(event => event._id);

        const bookings = await Booking.find({
            event: { $in: eventIds }
        })
            .populate("attendee", "name email phone")
            .populate("event", "title venue location date image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Get organizer bookings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to load organizer bookings"
        });
    }
};

module.exports = {
    createRazorpayOrder,
    createBooking,
    getMyBookings,
    getBookingById,
    getAllBookings,
    getOrganizerBookings,
    cancelBooking
};
