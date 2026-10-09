require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Database Connection
const connectDB = require(
    "./Backend Configuration/Configuration Folders/DB Configuration/dbConfig"
);

connectDB();

// API Routes
const authRoutes = require("./Backend Configuration/Routes/Auth Route/authRoutes");
const eventRoutes = require("./Backend Configuration/Routes/Event Route/eventRoutes");
const bookingRoutes = require("./Backend Configuration/Routes/Booking Route/bookingRoutes");
const ticketRoutes = require("./Backend Configuration/Routes/Ticket Route/ticketRoutes");
const adminRoutes = require("./Backend Configuration/Routes/Admin Route/adminRoutes");
const getUserRoutes = require("./Backend Configuration/Routes/Get All User Route/getUser");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", getUserRoutes);

const path = require("path");

// Health Check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Eventix API is running smoothly",
        version: "1.0.0",
        timestamp: new Date()
    });
});

// 404 Handler for undefined API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: `API Route ${req.originalUrl} not found`
    });
});

// Serve frontend static files in production
const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

// Single Page Application (SPA) fallback handler
app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
        return next();
    }
    res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
        if (err) {
            res.status(200).send("Eventix Backend API is running. Build frontend with 'npm run build' inside client directory.");
        }
    });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error("Unhandled Server Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// Server Listen
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});