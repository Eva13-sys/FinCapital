import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

const STOCKS_DIR = path.join(process.cwd(), "data", "nifty50");

router.get("/search", (req, res) => {
  const q = (req.query.q || "").toUpperCase();
  if (!q) return res.json([]);

  if (!fs.existsSync(STOCKS_DIR)) {
    return res.status(500).json({ error: "Stocks directory not found" });
  }

  const results = fs
    .readdirSync(STOCKS_DIR)
    .filter(f => f.endsWith(".csv"))
    .map(f => f.replace(".csv", ""))
    .filter(symbol => symbol.includes(q))
    .slice(0, 10)
    .map(symbol => ({
      symbol,
      name: symbol
    }));

  res.json(results);
});

export default router;
