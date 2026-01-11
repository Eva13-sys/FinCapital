import express from "express";
import Portfolio from "../models/Portfolio.js";
import verifyFirebaseToken from "../middleware/firebaseAuth.js";

const router = express.Router();

router.get("/", verifyFirebaseToken, async (req, res) => {
  const userId = req.user._id;

  const holdings = await Portfolio.find({ userId }).lean();

  const rows = holdings.map(h => {
    const value = +(h.quantity * h.avgPrice).toFixed(2);
    return {
      ...h,
      value,
      pnl: 0
    };
  });

  res.json({
    rows,
    totalValue: rows.reduce((a, b) => a + b.value, 0),
    totalPnl: 0
  });
});

export default router;
