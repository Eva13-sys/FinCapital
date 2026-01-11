import express from "express";
import Goal from "../models/Goal.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId } = req.query;
  const goals = await Goal.find({ userId }).sort({ createdAt: -1 });
  res.json(goals);
});

router.post("/", async (req, res) => {
  const goal = await Goal.create(req.body);
  res.json(goal);
});

router.put("/:id", async (req, res) => {
  const updated = await Goal.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});
router.put("/:id/save", async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  goal.currentAmount += req.body.amount;
  goal.lastSavedAt = new Date();
  goal.history.push({ amount: goal.currentAmount });

  if (goal.currentAmount >= goal.targetAmount) {
    goal.status = "Completed";
  } else {
    goal.status = "On Track";
  }

  await goal.save();
  res.json(goal);
});

router.delete("/:id", async (req, res) => {
  await Goal.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
