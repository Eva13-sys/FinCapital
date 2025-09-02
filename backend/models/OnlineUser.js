// backend/models/OnlineUser.js
import mongoose from "mongoose";

const OnlineUserSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  socketId: {
    type: String,
    required: true,
    unique: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster queries
OnlineUserSchema.index({ userId: 1 });
OnlineUserSchema.index({ socketId: 1 });
OnlineUserSchema.index({ lastSeen: 1 });

// Remove old entries periodically
OnlineUserSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 86400 }); // 24 hours

export default mongoose.model('OnlineUser', OnlineUserSchema);