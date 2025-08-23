const express = require('express');
const Chart = require('../models/Chart');
const auth = require('../middleware/firebaseAuth');

const router = express.Router();

// Get chart data for user
router.get('/', firebaseAuth, async (req, res) => {
  try {
    let chart = await Chart.findOne({ user: req.user });
    if (!chart) {
      chart = new Chart({ user: req.user, labels: [], values: [] });
      await chart.save();
    }
    res.json({ labels: chart.labels, values: chart.values });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save/update chart data for user
router.post('/', Fireuth, async (req, res) => {
  const { labels, values } = req.body;
  try {
    let chart = await Chart.findOne({ user: req.user });
    if (!chart) {
      chart = new Chart({ user: req.user, labels, values });
    } else {
      chart.labels = labels;
      chart.values = values;
      chart.updatedAt = Date.now();
    }
    await chart.save();
    res.json({ message: 'Chart data saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
