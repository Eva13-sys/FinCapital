const express = require("express");
const router = express.Router();
const Company = require("../models/Company");

router.get("/", async (req, res) => {
  try {
    const { envFriendly, womenLed, topGovernance } = req.query;

    let query = {};

    if (envFriendly === "true") {
      query.environment_score = { $gte: 70 };
    }

    if (womenLed === "true") {
      query.social_level = "Women-led"; // adjust based on dataset field
    }

    if (topGovernance === "true") {
      query.governance_score = { $gte: 90 }; // example threshold
    }

    const companies = await Company.find(query).limit(50); // limit for frontend
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
