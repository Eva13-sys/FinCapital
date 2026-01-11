import express from "express";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Portfolio from "../models/Portfolio.js";
import Wallet from "../models/Wallet.js";
import verifyFirebaseToken from "../middleware/firebaseAuth.js";

const router = express.Router();

router.post("/", verifyFirebaseToken, async (req, res) => {
  const { ticker, name, transactionType, quantity, price } = req.body;
  const userId = req.user._id;

  if (!ticker || !quantity || !price) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const totalValue = +(quantity * price).toFixed(2);

  const wallet = await Wallet.findOne({ userId });
  if (!wallet) return res.status(404).json({ error: "Wallet not found" });

  if (transactionType === "BUY" && wallet.tradingBalance < totalValue) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await Transaction.create([{
      userId,
      ticker,
      name,
      transactionType,
      quantity,
      price,
      totalValue
    }], { session });

    let holding = await Portfolio.findOne({ userId, ticker }).session(session);

    if (transactionType === "BUY") {
      if (holding) {
        holding.avgPrice =
          ((holding.avgPrice * holding.quantity) + totalValue) /
          (holding.quantity + quantity);
        holding.quantity += quantity;
        await holding.save({ session });
      } else {
        await Portfolio.create([{
          userId,
          ticker,
          name,
          quantity,
          avgPrice: price
        }], { session });
      }
      wallet.tradingBalance -= totalValue;
    }

    if (transactionType === "SELL") {
      if (!holding || holding.quantity < quantity) {
        throw new Error("Not enough holdings");
      }
      holding.quantity -= quantity;
      if (holding.quantity === 0) await holding.deleteOne({ session });
      else await holding.save({ session });
      wallet.tradingBalance += totalValue;
    }

    await wallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: err.message });
  }
});

export default router;
