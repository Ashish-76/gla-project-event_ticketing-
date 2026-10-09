const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getMe,
    updateProfile,
    changePassword
} = require("../../Controllers/Registration and Login Controller/authController");

const authMiddleware = require(
    "../../Configuration Folders/Middleware Configuration/authMiddleware"
);

// Public Routes
router.post("/register", register);
router.post("/login", login);

// Authenticated User Routes
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
