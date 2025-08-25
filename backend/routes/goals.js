import express from "express";
const router = express.Router();
import Goal from "../models/Goal.js";

// Add new goal
router.post("/", async (req, res) => {
    try {
        const { title , targetAmount, weeklySaving } = req.body;
        const newGoal = new Goal({
            title,
            targetAmount,
            weeklySaving,
            currentAmount: 0,
            status: "On Track",
        });
        await newGoal.save();
        res.status(201).json(newGoal);
    } catch (err){
        res.status(500).json({ error: err.message });
    }
});


// ✅ Get all goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update progress
router.patch("/:id", async (req, res) => {
  try {
    const { amount } = req.body; // Add this much to currentAmount

    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    goal.currentAmount += amount;

    // Update status automatically
    goal.status = goal.currentAmount >= goal.targetAmount
      ? "Completed"
      : (goal.currentAmount >= (goal.weeklySaving * ((Date.now() - goal.createdAt) / (7 * 24 * 60 * 60 * 1000)))
          ? "On Track"
          : "Behind");

    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Save money into a goal
router.put("/:id/save", async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ error: "Goal not found" });

    goal.currentAmount += amount;
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "Completed 🎉";
      goal.currentAmount = goal.targetAmount; // cap at target
    }

    await goal.save();
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
export default router;
