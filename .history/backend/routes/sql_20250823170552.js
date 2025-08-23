import express from "express";
import db from "../models/sql/index.js";

const { User, Stock, Portfolio, Transaction } = db;
const router = express.Router();

// ✅ Users
router.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// ✅ Stocks
router.get("/stocks", async (req, res) => {
  const stocks = await Stock.findAll();
  res.json(stocks);
});

// ✅ Portfolio
router.get("/portfolio/:userId", async (req, res) => {
  const portfolio = await Portfolio.findAll({ where: { userId: req.params.userId } });
  res.json(portfolio);
});

// ransactions
router.post("/transaction", async (req, res) => {
  const tx = await Transaction.create(req.body);
  res.json(tx);
});

export default router;
