const express = require("express");
const router = express.Router();

const {
    createEvent,
    getAllEvents,
    getMyEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getEventMetadata
} = require("../../Controllers/Event Controller/eventController");

const authMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/authMiddleware"
);

const roleMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/roleMiddleware"
);

// GET METADATA (Categories, Locations)
router.get("/meta", getEventMetadata);

// GET ALL EVENTS (Public)
router.get("/", getAllEvents);

// GET MY EVENTS (Organizer + Admin)
router.get(
    "/my",
    authMiddleware,
    roleMiddleware("organizer", "admin"),
    getMyEvents
);

// GET SINGLE EVENT (Public)
router.get("/:id", getEventById);

// CREATE EVENT (Organizer + Admin)
router.post(
    "/",
    authMiddleware,
    roleMiddleware("organizer", "admin"),
    createEvent
);

// UPDATE EVENT (Organizer + Admin)
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("organizer", "admin"),
    updateEvent
);

// DELETE EVENT (Organizer + Admin)
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("organizer", "admin"),
    deleteEvent
);

module.exports = router;