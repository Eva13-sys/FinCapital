import mongoose from "mongoose";

const ESGWatchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    companies: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("ESGWatchlist", ESGWatchlistSchema);
