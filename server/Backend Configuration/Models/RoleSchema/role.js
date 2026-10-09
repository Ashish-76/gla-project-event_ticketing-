const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            enum: ["attendee", "organizer", "admin"]
        },
        displayName: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: ""
        },
        permissions: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Role", roleSchema);
