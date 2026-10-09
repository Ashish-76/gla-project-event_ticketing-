const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        action: {
            type: String,
            required: true
        },
        category: {
            type: String,
            enum: ["auth", "event", "booking", "ticket", "admin", "system"],
            default: "system"
        },
        details: {
            type: String,
            default: ""
        },
        metadata: {
            type: Object,
            default: {}
        },
        ipAddress: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
