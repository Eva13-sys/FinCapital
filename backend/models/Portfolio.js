import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ticker: { type: String, required: true, index: true },
  name: { type: String, default: '' },
  quantity: { type: Number, default: 0 },
  avgPrice: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

PortfolioSchema.index({ userId: 1, ticker: 1 }, { unique: true });

export default mongoose.model('Portfolio', PortfolioSchema);
