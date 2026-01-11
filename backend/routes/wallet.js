import express from "express";
import Wallet from "../models/Wallet.js";
import verifyFirebaseToken from "../middleware/firebaseAuth.js";

const router = express.Router();

router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user._id; 

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        bankBalance: 0,
        tradingBalance: 0,
        goalBalance: 0,
      });
    }

    res.json(wallet);
  } catch (err) {
    console.error("Wallet GET error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/add-bank", verifyFirebaseToken, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const userId = req.user._id;

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({
        userId,
        bankBalance: amount,
        tradingBalance: 0,
        goalBalance: 0,
      });
    } else {
      wallet.bankBalance += amount;
      await wallet.save();
    }

    res.json(wallet);
  } catch (err) {
    console.error("Add bank error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/allocate", verifyFirebaseToken, async (req, res) => {
  try {
    const { to, amount } = req.body;
    const userId = req.user._id;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    if (wallet.bankBalance < amount) {
      return res.status(400).json({ error: "Insufficient bank balance" });
    }

    if (to === "trading") {
      wallet.bankBalance -= amount;
      wallet.tradingBalance += amount;
    }

    if (to === "goal") {
      wallet.bankBalance -= amount;
      wallet.goalBalance += amount;
    }

    await wallet.save();
    res.json(wallet);
  } catch (err) {
    console.error("Allocate error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
