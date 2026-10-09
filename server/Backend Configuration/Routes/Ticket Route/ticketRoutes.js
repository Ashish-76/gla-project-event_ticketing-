const express = require("express");
const router = express.Router();

const {
    getTicketsByBooking,
    verifyTicket,
    checkInTicket,
    getEventAttendees
} = require("../../Controllers/Ticket Controller/ticketController");

const authMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/authMiddleware"
);

const roleMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/roleMiddleware"
);

// GET TICKETS BY BOOKING ID (Owner, Organizer or Admin)
router.get(
    "/booking/:bookingId",
    authMiddleware,
    getTicketsByBooking
);

// VERIFY TICKET (Organizer or Admin)
router.post(
    "/verify",
    authMiddleware,
    roleMiddleware("organizer", "admin"),
    verifyTicket
);

// CHECK-IN TICKET (Organizer or Admin)
router.post(
    "/checkin",
    authMiddleware,
    roleMiddleware("organizer", "admin"),
    checkInTicket
);

// GET ATTENDEES ROSTER (Organizer or Admin)
router.get(
    "/event/:eventId/attendees",
    authMiddleware,
    roleMiddleware("organizer", "admin"),
    getEventAttendees
);

module.exports = router;
