import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Sample realistic demo dataset
const demoData = [
  { balance: 150000, change: 5.2, esg: 78 },
  { balance: 220000, change: 3.8, esg: 82 },
  { balance: 95000, change: -1.4, esg: 65 },
  { balance: 305000, change: 7.9, esg: 90 }
];

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    // Pick random demo stats for the new user
    const randomDemo = demoData[Math.floor(Math.random() * demoData.length)];

    user = new User({
      email,
      password: hashed,
      balance: randomDemo.balance,
      change: randomDemo.change,
      esg: randomDemo.esg
    });

    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;


// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const router = express.Router();

// // Register
// router.post('/register', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ error: 'User already exists' });
//     const hashed = await bcrypt.hash(password, 10);
//     // Add demo stats for new users
//     user = new User({
//       email,
//       password: hashed,
//       balance: 25000,
//       change: 5.2,
//       esg: 78
//     });
//     await user.save();
//     res.status(201).json({ message: 'User registered' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: 'Invalid credentials' });
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
