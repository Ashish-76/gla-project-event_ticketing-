const express = require("express");
const router = express.Router();

const {
    createRazorpayOrder,
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    getAllBookings,
    getOrganizerBookings
} = require("../../Controllers/Booking Controller/bookingController");

const roleMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/roleMiddleware"
);

const authMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/authMiddleware"
);

// CREATE RAZORPAY ORDER
router.post("/create-razorpay-order", authMiddleware, createRazorpayOrder);

// CREATE BOOKING (Any Authenticated User)
router.post("/", authMiddleware, createBooking);

// GET MY BOOKINGS (Attendee)
router.get("/my", authMiddleware, getMyBookings);

// GET ORGANIZER BOOKINGS (Organizer + Admin)
router.get(
    "/organizer",
    authMiddleware,
    roleMiddleware("organizer", "admin"),
    getOrganizerBookings
);

// GET ALL BOOKINGS (Admin)
router.get(
    "/admin",
    authMiddleware,
    roleMiddleware("admin"),
    getAllBookings
);

// GET SINGLE BOOKING
router.get("/:id", authMiddleware, getBookingById);

// CANCEL BOOKING
router.post("/:id/cancel", authMiddleware, cancelBooking);

module.exports = router;