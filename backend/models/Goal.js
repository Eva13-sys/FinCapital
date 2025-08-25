import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    weeklySaving: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    status: { type: String, default: "On Track" },
    status: { type: String, enum: ["On Track", "Behind"], default: "On Track" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Goal", goalSchema);
