const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        currency: {
            type: String,
            default: "INR"
        },
        paymentMethod: {
            type: String,
            enum: ["card", "upi", "netbanking", "wallet", "razorpay", "free"],
            default: "razorpay"
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "completed"
        },
        transactionId: {
            type: String,
            required: true,
            unique: true
        },
        paymentDetails: {
            type: Object,
            default: {}
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Payment", paymentSchema);
