import express from 'express';
import Company from '../models/Company.js';
const router = express.Router();
//Get all the companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
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