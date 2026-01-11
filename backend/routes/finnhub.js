import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const url =
      `https://finnhub.io/api/v1/search` +
      `?q=${q}&token=${process.env.FINNHUB_API_KEY}`;

    const r = await fetch(url);
    const data = await r.json();

    const results = (data.result || []).map(s => ({
      symbol: s.symbol,
      name: s.description,
    }));

    res.json(results);
  } catch (e) {
    console.error("Finnhub search error:", e);
    res.json([]);
  }
});

export default router;
