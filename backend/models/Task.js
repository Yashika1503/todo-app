const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        dueDate: {
            type: Date,
            required: true
        },

        completed: {
            type: Boolean,
            default: false
        },

        reminderTime: {
            type: Date
        },

        reminderSent: {
            type: Boolean,
            default: false
        },

        repeat: {
            type: String,
            enum: ["none", "daily", "weekly", "custom"],
            default: "none"
        }
    },

    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);