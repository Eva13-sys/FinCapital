const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// GET all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one company by ticker
router.get('/:ticker', async (req, res) => {
  try {
    const company = await Company.findOne({ ticker: req.params.ticker });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new company
router.post('/', async (req, res) => {
  try {
    const company = new Company(req.body);
    const newCompany = await company.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
