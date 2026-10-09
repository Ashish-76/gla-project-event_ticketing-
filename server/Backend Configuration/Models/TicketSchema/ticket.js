const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },

        attendee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        ticketTypeId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        ticketTypeName: {
            type: String,
            required: true
        },

        unitPrice: {
            type: Number,
            default: 0
        },

        ticketCode: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        qrCode: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: [
                "active",
                "used",
                "cancelled"
            ],
            default: "active"
        },

        checkedInAt: {
            type: Date,
            default: null
        },

        checkedInBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Ticket", ticketSchema);