import express from "express";
import fs from "fs";
import path from "path";
import { loadCSV } from "../utils/loadCSV.js";

const router = express.Router();

// 📈 Replay / Historical candles for ONE stock
router.get("/history/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const filePath = path.join(
      process.cwd(),
      "data",
      "nifty50",
      `${symbol}.csv`
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json([]);
    }

    const rows = await loadCSV(filePath);

    const candles = rows.map(r => ({
      Date: r.Date,
      Open: Number(r.Open),
      High: Number(r.High),
      Low: Number(r.Low),
      Close: Number(r.Close),
      Volume: Number(r.Volume)
    }));

    res.json(candles);
  } catch (err) {
    console.error("Market history error:", err);
    res.status(500).json({ error: "Failed to load market data" });
  }
});

export default router;
