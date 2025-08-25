// // const admin = require("../config/firebase");

// // module.exports = async function (req, res, next) {
// //   const authHeader = req.headers.authorization;

// //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //     return res.status(401).json({ error: "No token provided" });
// //   }

// //   const token = authHeader.split(" ")[1];

// //   try {
// //     // Verify Firebase ID token
// //     const decodedToken = await admin.auth().verifyIdToken(token);
// //     req.firebaseUid = decodedToken.uid;
// //     req.firebaseEmail = decodedToken.email;
// //     next();
// //   } catch (err) {
// //     console.error(err);
// //     res.status(401).json({ error: "Invalid or expired token" });
// //   }
// // };
// const admin = require('firebase-admin');

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(require('../config/firebaseServiceAccount.json')),
//   });
// }

// module.exports = async (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader?.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'No token provided' });
//   }

//   const idToken = authHeader.split('Bearer ')[1];
//   try {
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     req.firebaseUid = decodedToken.uid;
//     req.firebaseEmail = decodedToken.email;
//     next();
//   } catch (error) {
//     console.error('Firebase Auth Error:', error);
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };
// backend/middleware/firebaseAuth.js
import admin from 'firebase-admin';
import serviceAccount from '../config/fincapital-374df-firebase-adminsdk-fbsvc-7afacd6da3.json' with { type: 'json' };

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.user = decodedToken;
    req.firebaseUid = decodedToken.uid;
    req.firebaseEmail = decodedToken.email || "no-email@demo.com";

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(403).json({ message: "Unauthorized" });
  }
};

export default verifyFirebaseToken;
