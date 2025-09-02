// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import express from 'express';
// import User from '../models/User.js';

// const router = express.Router();

// // Sample realistic demo dataset
// const demoData = [
//   { balance: 150000, change: 5.2, esg: 78 },
//   { balance: 220000, change: 3.8, esg: 82 },
//   { balance: 95000, change: -1.4, esg: 65 },
//   { balance: 305000, change: 7.9, esg: 90 }
// ];

// // Register
// router.post('/register', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ error: 'User already exists' });

//     const hashed = await bcrypt.hash(password, 10);

//     // Pick random demo stats for the new user
//     const randomDemo = demoData[Math.floor(Math.random() * demoData.length)];

//     user = new User({
//       email,
//       password: hashed,
//       balance: randomDemo.balance,
//       change: randomDemo.change,
//       esg: randomDemo.esg
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

//     const token = jwt.sign(
//       { userId: user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

// backend/routes/auth.js

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
  const { email, password, name } = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    // Generate username from email
    const username = email.split('@')[0] + Math.floor(Math.random() * 1000);

    // Pick random demo stats for the new user
    const randomDemo = demoData[Math.floor(Math.random() * demoData.length)];

    user = new User({
      email,
      password,
      name: name || username,
      username,
      balance: randomDemo.balance,
      change: randomDemo.change,
      esg: randomDemo.esg,
      performance: randomDemo.change >= 0 ? `+${randomDemo.change}%` : `${randomDemo.change}%`
    });

    await user.save();
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
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

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ 
      token,
      user: user.toJSON()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify token middleware
export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId);
    
    if (!req.user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default router;