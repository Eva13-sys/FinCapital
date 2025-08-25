import express from 'express';
import User from '../models/User.js';
import firebaseAuth from '../middleware/firebaseAuth.js';

const router = express.Router();

const demoData = [
  { balance: 150000, change: 5.2, esg: 78 },
  { balance: 220000, change: 3.8, esg: 82 },
  { balance: 95000, change: -1.4, esg: 65 },
  { balance: 305000, change: 7.9, esg: 90 }
];

router.get('/', firebaseAuth, async (req, res) => {
  try {
    let user = await User.findOne({ firebaseUid: req.firebaseUid });
    if (!user) {
      const randomDemo = demoData[Math.floor(Math.random() * demoData.length)];
      user = new User({
        firebaseUid: req.firebaseUid,
        email: req.firebaseEmail,
        ...randomDemo
      });
      await user.save();
    }
    res.json({ balance: user.balance, change: user.change, esg: user.esg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', firebaseAuth, async (req, res) => {
  try {
    const { balance, change, esg } = req.body;
    let user = await User.findOne({ firebaseUid: req.firebaseUid });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.balance = Number(balance);
    user.change = Number(change);
    user.esg = Number(esg);
    await user.save();

    res.json({ message: 'Stats updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
