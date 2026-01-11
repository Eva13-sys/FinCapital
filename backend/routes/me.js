import express from "express";
import verifyFirebaseToken from "../middleware/firebaseAuth.js";

const router = express.Router();

router.get("/", verifyFirebaseToken, (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

export default router;
