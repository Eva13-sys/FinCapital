import express from 'express';
import Company from '../models/Company.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { filter, industry } = req.query;
    let query = {};

    if (filter === 'env_friendly') query.environment_level = 'High';
    if (filter === 'high_social') query.social_level = 'High';

    if (filter === 'top_governance') {
      const all = await Company.find().sort({ governance_score: -1 });
      const cutoffIndex = Math.floor(all.length * 0.1);
      return res.json(all.slice(0, cutoffIndex));
    }

    if (industry) query.industry = industry;

    const companies = await Company.find(query).limit(50);
    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
