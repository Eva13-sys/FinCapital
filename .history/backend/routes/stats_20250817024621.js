// // routes/stats.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// // const firebaseAuth = require('../middleware/firebaseAuth');
// const firebaseAuth = require('../middleware/firebaseAuth');

// // Sample realistic demo dataset
// const demoData = [
//   { balance: 150000, change: 5.2, esg: 78 },
//   { balance: 220000, change: 3.8, esg: 82 },
//   { balance: 95000, change: -1.4, esg: 65 },
//   { balance: 305000, change: 7.9, esg: 90 }
// ];


// // GET user stats (auto-create with demo data if not found)
// router.get('/', firebaseAuth, async (req, res) => {
//   try {
//     let user = await User.findOne({ firebaseUid: req.firebaseUid });
//     if (!user) {
//       const randomDemo = demoData[Math.floor(Math.random() * demoData.length)];
//       user = new User({
//         firebaseUid: req.firebaseUid,
//         email: req.firebaseEmail,
//         ...randomDemo
//       });
//       await user.save();
//     }
//     res.json({ balance: user.balance, change: user.change, esg: user.esg });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// // UPDATE user stats
// router.post('/', firebaseAuth, async (req, res) => {
//   try {
//     const { balance, change, esg } = req.body;
//     let user = await User.findOne({ firebaseUid: req.firebaseUid });
//     if (!user) return res.status(404).json({ error: 'User not found' });
//     user.balance = Number(balance);
//     user.change = Number(change);
//     user.esg = Number(esg);
//     await user.save();
//     res.json({ message: 'Stats updated successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;
// routes/stats.js const express = require('express'); const router = express.Router(); const User = require('../models/User'); // const firebaseAuth = require('../middleware/firebaseAuth'); const firebaseAuth = require('../middleware/firebaseAuth'); // Sample realistic demo dataset const demoData = [ { balance: 150000, change: 5.2, esg: 78 }, { balance: 220000, change: 3.8, esg: 82 }, { balance: 95000, change: -1.4, esg: 65 }, { balance: 305000, change: 7.9, esg: 90 } ]; // GET user stats (auto-create with demo data if not found) router.get('/', firebaseAuth, async (req, res) => { try { let user = await User.findOne({ firebaseUid: req.firebaseUid }); if (!user) { const randomDemo = demoData[Math.floor(Math.random() * demoData.length)]; user = new User({ firebaseUid: req.firebaseUid, email: req.firebaseEmail, ...randomDemo }); await user.save(); } res.json({ balance: user.balance, change: user.change, esg: user.esg }); } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); } }); // UPDATE user stats router.post('/', firebaseAuth, async (req, res) => { try { const { balance, change, esg } = req.body; let user = await User.findOne({ firebaseUid: req.firebaseUid }); if (!user) return res.status(404).json({ error: 'User not found' }); user.balance = Number(balance); user.change = Number(change); user.esg = Number(esg); await user.save(); res.json({ message: 'Stats updated successfully' }); } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); } }); module.exports = router; and // backend/middleware/firebaseAuth.js const admin = require("firebase-admin"); const serviceAccount = require("../config/fincapital-374df-firebase-adminsdk-fbsvc-460843d396.json"); if (!admin.apps.length) { admin.initializeApp({ credential: admin.credential.cert(serviceAccount), }); } const verifyFirebaseToken = async (req, res, next) => { try { const authHeader = req.headers.authorization; if (!authHeader || !authHeader.startsWith("Bearer ")) { return res.status(401).json({ message: "No token provided" }); } const idToken = authHeader.split("Bearer ")[1]; const decodedToken = await admin.auth().verifyIdToken(idToken); req.user = decodedToken; next(); } catch (error) { console.error("Error verifying token:", error); res.status(403).json({ message: "Unauthorized" }); } }; module.exports = verifyFirebaseToken; anf const mongoose = require('mongoose'); const UserSchema = new mongoose.Schema({ firebaseUid: { type: String, unique: true, sparse: true }, email: { type: String, required: true }, password: { type: String, required: true }, balance: { type: Number, default: 0 }, change: { type: Number, default: 0 }, esg: { type: Number, default: 0 } }); module.exports = mongoose.model('User', UserSchema);