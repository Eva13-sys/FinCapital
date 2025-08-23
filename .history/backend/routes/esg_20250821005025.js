const express = require("express");
const router = express.Router();
const Company = require("../models/Company");

// GET /api/esg?filter=env_friendly&industry=Automobiles
router.get("/", async (req, res) => {
  try {
    const { filter, industry } = req.query;
    let query = {};
    if (filter === "env_friendly") {
      query.environment_level = "High"; // or environment_score >= 500
    }

    if (filter === "high_social") {
      query.social_level = "High"; // or social_grade = "A"
    }

    if (filter === "top_governance") {
      // Special case: top 10% governance → handled separately
      const all = await Company.find().sort({ governance_score: -1 });
      const cutoffIndex = Math.floor(all.length * 0.1); // 10%
      return res.json(all.slice(0, cutoffIndex));
    }

    if (industry) {
      query.industry = industry;
    }

    // ✅ Fetch from DB
    const companies = await Company.find(query).limit(50); // limit for frontend
    res.json(companies);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
