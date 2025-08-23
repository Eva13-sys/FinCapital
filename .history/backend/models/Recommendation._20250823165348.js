import mongoose from "mongoose";

const RecommendationSchema = new mongoose.Schema({
  userId: String,
  basedOn: String,
  stocks: [{ ticker: String, reason: String }],
});

export default mongoose.model("Recommendation", RecommendationSchema);
