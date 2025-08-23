import express from "express";
import Watchlist from "../models/Watchlist.js";
import PriceAlert from "../models/mongo/PriceAlert.js";

const router = express.Router();

// ✅ Watchlist
router.post("/watchlist", async (req, res) => {
  const wl = new Watchlist(req.body);
  await wl.save();
  res.json(wl);
});

router.get("/watchlist/:userId", async (req, res) => {
  const lists = await Watchlist.find({ userId: req.params.userId });
  res.json(lists);
});

// ✅ Price Alerts
router.post("/alerts", async (req, res) => {
  const alert = new PriceAlert(req.body);
  await alert.save();
  res.json(alert);
});

router.get("/alerts/:userId", async (req, res) => {
  const alerts = await PriceAlert.find({ userId: req.params.userId });
  res.json(alerts);
});

export default router;
