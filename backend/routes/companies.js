import express from 'express';
import Company from '../models/Company.js';
const router = express.Router();
//Get all the companies
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;

    const { environmental, topGovernance, industry, search } = req.query;
    const query = {};

    if (environmental === "true") {
      query.environmentalScore = { $gte: 0 };
    }
    if (industry && industry !== "") {
      query.industry = industry;
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { ticker: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Company.countDocuments(query);
    const companies = await Company.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ name: 1 });

    res.json({
      data: companies,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const normal = new RegExp(escaped, "i");
    const fuzzy = new RegExp(escaped.split("").join(".*"), "i");

    const companies = await Company.find({
      $or: [
        { ticker: { $regex: normal } },
        { name: { $regex: normal } },
        { ticker: { $regex: fuzzy } },
        { name: { $regex: fuzzy } },
      ],
    })
      .limit(10)
      .select("ticker name industry esg total_score");

    res.json(companies);
  } catch (err) {
    console.error("Company search error:", err);
    res.status(500).json({ message: err.message });
  }
});

//Get companies by ticker
router.get('/:ticker', async (req, res) => {
  try {
    const company = await Company.findOne({ ticker: req.params.ticker });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//Add new company
router.post('/', async (req, res) => {
  try {
    const company = new Company(req.body);
    const newCompany = await company.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;