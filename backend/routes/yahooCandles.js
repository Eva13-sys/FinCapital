import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/candles", async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) return res.json([]);

    const period2 = Math.floor(Date.now() / 1000);
    const period1 = period2 - 60 * 60 * 24 * 365; // 1 year

    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}` +
      `?period1=${period1}` +
      `&period2=${period2}` +
      `&interval=1d`;

    const r = await fetch(url);
    const data = await r.json();

    const result = data.chart?.result?.[0];
    if (!result) return res.json([]);

    const { timestamp, indicators } = result;
    const quote = indicators.quote[0];

    const candles = timestamp.map((t, i) => ({
      time: t,
      open: quote.open[i],
      high: quote.high[i],
      low: quote.low[i],
      close: quote.close[i],
    }));

    res.json(candles);
  } catch (e) {
    console.error("Yahoo candle error:", e);
    res.status(500).json([]);
  }
});

export default router;
