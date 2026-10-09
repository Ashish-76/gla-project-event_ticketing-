const Event = require("../../Models/EventSchema/event");
const Booking = require("../../Models/BookingSchema/booking");
const Ticket = require("../../Models/TicketSchema/ticket");
const ActivityLog = require("../../Models/ActivityLogSchema/activityLog");

// CREATE EVENT
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            venue,
            location,
            date,
            startTime,
            endTime,
            image,
            ticketTypes,
            status
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !venue ||
            !location ||
            !date ||
            !startTime ||
            !endTime ||
            !ticketTypes ||
            !ticketTypes.length
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required event details including at least one ticket type"
            });
        }

        const event = await Event.create({
            title: title.trim(),
            description: description.trim(),
            category: category.trim(),
            venue: venue.trim(),
            location: location.trim(),
            date,
            startTime,
            endTime,
            image: image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
            ticketTypes,
            status: status || "draft",
            organizer: req.user._id
        });

        // Audit Log
        await ActivityLog.create({
            user: req.user._id,
            action: "EVENT_CREATED",
            category: "event",
            details: `Created event "${event.title}"`,
            metadata: { eventId: event._id }
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event
        });

    } catch (error) {
        console.error("Create event error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET ALL EVENTS (With Search, Filtering, Sorting & Pagination)
const getAllEvents = async (req, res) => {
    try {
        const {
            search,
            category,
            location,
            status = "published",
            sort = "date_asc",
            minPrice,
            maxPrice,
            page = 1,
            limit = 100
        } = req.query;

        const query = {};

        // Status filter: Public only sees "published", Admin/Organizer can see all if specified
        if (status && status !== "all") {
            query.status = status;
        }

        // Search text
        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            query.$or = [
                { title: regex },
                { description: regex },
                { venue: regex },
                { location: regex },
                { category: regex }
            ];
        }

        // Category filter
        if (category && category !== "All") {
            query.category = new RegExp(`^${category.trim()}$`, "i");
        }

        // Location filter
        if (location && location !== "All") {
            query.location = new RegExp(location.trim(), "i");
        }

        // Price Filter
        if (minPrice || maxPrice) {
            query["ticketTypes.price"] = {};
            if (minPrice) query["ticketTypes.price"].$gte = Number(minPrice);
            if (maxPrice) query["ticketTypes.price"].$lte = Number(maxPrice);
        }

        // Sorting
        let sortOption = { date: 1 };
        if (sort === "date_desc") sortOption = { date: -1 };
        else if (sort === "price_asc") sortOption = { "ticketTypes.price": 1 };
        else if (sort === "price_desc") sortOption = { "ticketTypes.price": -1 };
        else if (sort === "created_desc") sortOption = { createdAt: -1 };
        else if (sort === "popular") sortOption = { "ticketTypes.sold": -1 };

        const skip = (Number(page) - 1) * Number(limit);

        const events = await Event.find(query)
            .populate("organizer", "name email phone profileImage")
            .sort(sortOption)
            .skip(skip)
            .limit(Number(limit));

        const totalEvents = await Event.countDocuments(query);

        res.status(200).json({
            success: true,
            count: events.length,
            totalEvents,
            totalPages: Math.ceil(totalEvents / Number(limit)),
            currentPage: Number(page),
            events
        });

    } catch (error) {
        console.error("Get all events error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET MY EVENTS (Organizer)
const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({
            organizer: req.user._id
        }).sort({ createdAt: -1 });

        // Calculate stats for each event
        const eventsWithStats = await Promise.all(
            events.map(async (event) => {
                const eObj = event.toObject();
                const totalTickets = event.ticketTypes.reduce((acc, t) => acc + t.capacity, 0);
                const soldTickets = event.ticketTypes.reduce((acc, t) => acc + t.sold, 0);
                const revenue = event.ticketTypes.reduce((acc, t) => acc + (t.sold * t.price), 0);
                
                const checkedInTickets = await Ticket.countDocuments({
                    event: event._id,
                    status: "used"
                });

                eObj.stats = {
                    totalTickets,
                    soldTickets,
                    availableTickets: totalTickets - soldTickets,
                    revenue,
                    checkedInTickets
                };
                return eObj;
            })
        );

        res.status(200).json({
            success: true,
            count: eventsWithStats.length,
            events: eventsWithStats
        });

    } catch (error) {
        console.error("Get my events error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET EVENT BY ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("organizer", "name email phone profileImage");

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            event
        });

    } catch (error) {
        console.error("Get event by ID error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE EVENT
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Check ownership or admin
        if (
            req.user.role !== "admin" &&
            event.organizer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this event"
            });
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "venue",
            "location",
            "date",
            "startTime",
            "endTime",
            "image",
            "ticketTypes",
            "status"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                event[field] = req.body[field];
            }
        });

        await event.save();

        // Audit Log
        await ActivityLog.create({
            user: req.user._id,
            action: "EVENT_UPDATED",
            category: "event",
            details: `Updated event "${event.title}" (Status: ${event.status})`,
            metadata: { eventId: event._id }
        });

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event
        });

    } catch (error) {
        console.error("Update event error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE EVENT
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        // Check ownership or admin
        if (
            req.user.role !== "admin" &&
            event.organizer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this event"
            });
        }

        await Event.findByIdAndDelete(req.params.id);

        // Audit Log
        await ActivityLog.create({
            user: req.user._id,
            action: "EVENT_DELETED",
            category: "event",
            details: `Deleted event "${event.title}"`,
            metadata: { eventId: event._id }
        });

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.error("Delete event error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET UNIQUE CATEGORIES & LOCATIONS
const getEventMetadata = async (req, res) => {
    try {
        const categories = await Event.distinct("category", { status: "published" });
        const locations = await Event.distinct("location", { status: "published" });

        res.status(200).json({
            success: true,
            categories: categories.filter(Boolean),
            locations: locations.filter(Boolean)
        });
    } catch (error) {
        console.error("Get metadata error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getMyEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getEventMetadata
};