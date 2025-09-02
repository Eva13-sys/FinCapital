import mongoose from "mongoose";

const tradeCheckinSchema = new mongoose.Schema({
  userId: { type: String, default: "demoUser" }, // extend later for auth
  tradeType: { type: String, enum: ["Buy", "Sell"], required: true },
  mood: { type: String, required: true },
  conviction: { type: Number, required: true },
  reflection: { type: String },
  stock: { type: String },
  aiAdvice: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("TradeCheckin", tradeCheckinSchema);
