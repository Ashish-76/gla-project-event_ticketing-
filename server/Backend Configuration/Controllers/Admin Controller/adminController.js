const User = require("../../Models/UserSchema/user");
const Event = require("../../Models/EventSchema/event");
const Booking = require("../../Models/BookingSchema/booking");
const Ticket = require("../../Models/TicketSchema/ticket");
const Payment = require("../../Models/PaymentSchema/payment");
const ActivityLog = require("../../Models/ActivityLogSchema/activityLog");
const Setting = require("../../Models/SettingSchema/setting");

// GET ADMIN DASHBOARD STATS & ANALYTICS
const getAdminStats = async (req, res) => {
    try {
        // Counts
        const totalUsers = await User.countDocuments();
        const totalOrganizers = await User.countDocuments({ role: "organizer" });
        const totalAttendees = await User.countDocuments({ role: "attendee" });
        const activeUsers = await User.countDocuments({ isActive: true });

        const totalEvents = await Event.countDocuments();
        const publishedEvents = await Event.countDocuments({ status: "published" });
        const draftEvents = await Event.countDocuments({ status: "draft" });

        const totalBookings = await Booking.countDocuments();
        const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });
        const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });

        const totalTickets = await Ticket.countDocuments();
        const usedTickets = await Ticket.countDocuments({ status: "used" });

        // Revenue Calculation from confirmed bookings
        const revenueAggregate = await Booking.aggregate([
            { $match: { status: "confirmed" } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueAggregate.length ? revenueAggregate[0].totalRevenue : 0;

        // Category breakdown
        const categoryStats = await Event.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Recent 5 Bookings
        const recentBookings = await Booking.find()
            .populate("attendee", "name email")
            .populate("event", "title venue date")
            .sort({ createdAt: -1 })
            .limit(5);

        // Recent 10 Activity Logs
        const recentLogs = await ActivityLog.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    organizers: totalOrganizers,
                    attendees: totalAttendees,
                    active: activeUsers
                },
                events: {
                    total: totalEvents,
                    published: publishedEvents,
                    draft: draftEvents
                },
                bookings: {
                    total: totalBookings,
                    confirmed: confirmedBookings,
                    cancelled: cancelledBookings
                },
                tickets: {
                    total: totalTickets,
                    used: usedTickets
                },
                revenue: {
                    total: totalRevenue
                },
                categoryStats,
                recentBookings,
                recentLogs
            }
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin stats"
        });
    }
};

// GET ALL USERS (With Filtering & Search)
const getAllUsers = async (req, res) => {
    try {
        const { search, role, status } = req.query;
        const query = {};

        if (role && role !== "all") {
            query.role = role;
        }

        if (status && status !== "all") {
            query.isActive = status === "active";
        }

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            query.$or = [
                { name: regex },
                { email: regex },
                { phone: regex }
            ];
        }

        const users = await User.find(query)
            .select("-passwordHash")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

// UPDATE USER STATUS (Activate / Deactivate)
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be true or false"
            });
        }

        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot deactivate your own admin account"
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isActive = isActive;
        await user.save();

        await ActivityLog.create({
            user: req.user._id,
            action: "USER_STATUS_UPDATED",
            category: "admin",
            details: `Admin changed status of ${user.email} to ${isActive ? "Active" : "Inactive"}`
        });

        res.status(200).json({
            success: true,
            message: isActive ? "User activated successfully" : "User deactivated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error("Update user status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user status"
        });
    }
};

// UPDATE USER ROLE
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = ["attendee", "organizer", "admin"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own admin role"
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.role = role;
        await user.save();

        await ActivityLog.create({
            user: req.user._id,
            action: "USER_ROLE_UPDATED",
            category: "admin",
            details: `Admin changed role of ${user.email} to ${role}`
        });

        res.status(200).json({
            success: true,
            message: `User role changed to ${role} successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error("Update user role error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user role"
        });
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own admin account"
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(id);

        await ActivityLog.create({
            user: req.user._id,
            action: "USER_DELETED",
            category: "admin",
            details: `Admin deleted user ${user.email} (${user.name})`
        });

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};

// GET ACTIVITY LOGS
const getActivityLogs = async (req, res) => {
    try {
        const logs = await ActivityLog.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: logs.length,
            logs
        });
    } catch (error) {
        console.error("Get logs error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch activity logs"
        });
    }
};

// GET ALL PAYMENTS
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("user", "name email phone")
            .populate({
                path: "booking",
                populate: { path: "event", select: "title date venue" }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        console.error("Get payments error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch payments"
        });
    }
};

// GET & UPDATE SETTINGS
const getSettings = async (req, res) => {
    try {
        const settings = await Setting.find();
        res.status(200).json({
            success: true,
            settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateSetting = async (req, res) => {
    try {
        const { key, value, description } = req.body;
        if (!key) {
            return res.status(400).json({ success: false, message: "Key is required" });
        }

        const setting = await Setting.findOneAndUpdate(
            { key },
            { value, description },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: "Setting saved successfully",
            setting
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    getActivityLogs,
    getAllPayments,
    getSettings,
    updateSetting
};
