import mongoose from "mongoose";

const MentorInsightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tradeId: { type: mongoose.Schema.Types.ObjectId, ref: "Trade", required: true },
  mood: { type: String, enum: ["calm", "emotional", "confident"], required: true },
  confidence: { type: Number, min: 0, max: 100 },
  insights: [String],
  tips: [String],
  reflectionQuestions: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MentorInsight", MentorInsightSchema);
