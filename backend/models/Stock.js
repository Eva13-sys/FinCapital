import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, index: true },
  name: { type: String, default: '' },
  sector: { type: String, default: '' },
  price: { type: Number, default: 0 },
  current_price: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Stock', StockSchema);
