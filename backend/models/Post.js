// backend/models/Post.js
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  image: { 
    type: String, 
    default: '' 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  comments: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    content: { 
      type: String, 
      required: true,
      maxlength: 500
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  shares: { 
    type: Number, 
    default: 0 
  },
  tags: [{ 
    type: String,
    lowercase: true
  }],
  reports: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    reason: { 
      type: String, 
      required: true,
      enum: ['Spam', 'Harassment', 'Inappropriate Content', 'False Information', 'Other']
    },
    details: { 
      type: String, 
      maxlength: 500 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for better performance
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ createdAt: -1 });

export default mongoose.model('Post', PostSchema);