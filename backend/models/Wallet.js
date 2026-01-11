import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    userId: {type: String, required:true, unique: true},
    bankBalance: { type: Number, default: 0},
    tradingBalance: { type: Number, default: 0},
    goalBalance: { type: Number, default: 0},
    updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model("Wallet", walletSchema);
