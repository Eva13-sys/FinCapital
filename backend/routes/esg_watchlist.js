import express from "express";
import ESGWatchlist from "../models/ESG_Watchlist.js";

const router = express.Router();

/* Add company to user's watchlist */
router.post("/add", async (req, res) => {
  try {
    const { userId, company } = req.body;

    if (!userId || !company) {
      return res.status(400).json({ message: "Missing data" });
    }

    let watchlist = await ESGWatchlist.findOne({ userId });

    if (!watchlist) {
      watchlist = new ESGWatchlist({
        userId,
        companies: [],
      });
    }

    const exists = watchlist.companies.some(
      (c) => c._id.toString() === company._id
    );

    if (!exists) {
      watchlist.companies.push(company);
      await watchlist.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* Get user's watchlist */
router.get("/:userId", async (req, res) => {
  try {
    const watchlist = await ESGWatchlist.findOne({
      userId: req.params.userId,
    });

    res.json(watchlist || { companies: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/remove/:userId/:companyId", async (req, res) => {
  try {
    const { userId, companyId } = req.params;

    const watchlist = await ESGWatchlist.findOne({ userId });
    if (!watchlist) {
      return res.status(404).json({ message: "Watchlist not found" });
    }

    watchlist.companies = watchlist.companies.filter(
      (c) => c._id.toString() !== companyId
    );

    await watchlist.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
