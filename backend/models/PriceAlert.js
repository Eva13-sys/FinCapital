import mongoose from "mongoose";

const PriceAlertSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  ticker: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  direction: { type: String, enum: ["above", "below"], required: true },
  notified: { type: Boolean, default: false },
});

export default mongoose.model("PriceAlert", PriceAlertSchema);
