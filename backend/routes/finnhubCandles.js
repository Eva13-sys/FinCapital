import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/candles", async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) return res.json([]);

    const to = Math.floor(Date.now() / 1000);
    const from = to - 60 * 60 * 24 * 365; // last 1 year
    console.log("Finnhub key loaded:", !!process.env.FINNHUB_API_KEY);

    const url =
      `https://finnhub.io/api/v1/stock/candle` +
      `?symbol=${symbol}` +
      `&resolution=D` +          // ✅ DAILY (FREE)
      `&from=${from}` +
      `&to=${to}` +
      `&token=${process.env.FINNHUB_API_KEY}`;

    const r = await fetch(url);
    const data = await r.json();

    if (data.s !== "ok") {
      console.error("Finnhub daily candle error:", data);
      return res.json([]);
    }

    const candles = data.t.map((t, i) => ({
      time: t,              // UNIX seconds
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
    }));

    res.json(candles);
  } catch (e) {
    console.error("Finnhub daily route crash:", e);
    res.status(500).json([]);
  }
});

export default router;
