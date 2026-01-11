import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        targetAmount: {
            type: Number,
            required: true,
            min: 1,
        },

        currentAmount: {
            type: Number,
            default: 0,
            min: 0,
        },

        frequency: {
            type: String,
            enum: ["weekly", "monthly"],
            default: "weekly",
        },

        amountPerPeriod: {
            type: Number,
            required: true,
            min: 1,
        },

        status: {
            type: String,
            enum: ["On Track", "Behind", "Completed"],
            default: "On Track",
        },

        history: [
            {
                amount: { type: Number, required: true },
                date: { type: Date, default: Date.now },
            },
        ],

        lastSavedAt: {
            type: Date,
        },

        reminderEnabled: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);
export default mongoose.model("Goal", goalSchema);
