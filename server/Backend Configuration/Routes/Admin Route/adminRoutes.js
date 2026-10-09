const express = require("express");
const router = express.Router();

const {
    getAdminStats,
    getAllUsers,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    getActivityLogs,
    getAllPayments,
    getSettings,
    updateSetting
} = require("../../Controllers/Admin Controller/adminController");

const authMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/authMiddleware"
);

const roleMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/roleMiddleware"
);

// All Admin routes require Auth and Admin role
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// STATS
router.get("/stats", getAdminStats);

// USERS MANAGEMENT
router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// PAYMENTS & AUDIT LOGS
router.get("/payments", getAllPayments);
router.get("/logs", getActivityLogs);

// PLATFORM SETTINGS
router.get("/settings", getSettings);
router.post("/settings", updateSetting);

module.exports = router;
