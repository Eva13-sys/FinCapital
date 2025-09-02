// backend/models/ChatMessage.js
import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  userAvatar: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for better performance
ChatMessageSchema.index({ timestamp: 1 });

export default mongoose.model('ChatMessage', ChatMessageSchema);