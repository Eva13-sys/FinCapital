// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   firebaseUid: { type: String, unique: true, sparse: true },
//   email: { type: String, required: true },
//   password: { type: String}, 

//   balance: { type: Number, default: 0 },
//   change: { type: Number, default: 0 },
//   esg: { type: Number, default: 0 }
// });

// export default mongoose.model("User", UserSchema);

// backend/models/User.js
// backend/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUid: { 
    type: String, 
    unique: true, 
    sparse: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String
  },
  name: {
    type: String,
    default: '',
    trim: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  avatar: { 
    type: String, 
    default: '/uploads/avatars/default.png' 
  },
  bio: { 
    type: String, 
    default: '',
    maxlength: 500
  },
  rank: { 
    type: String, 
    default: 'Beginner',
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Pro Trader', 'Market Analyst', 'Crypto Expert', 'Options Guru']
  },
  performance: { 
    type: String, 
    default: '+0.0%' 
  },
  winRate: { 
    type: String, 
    default: '0%' 
  },
  followerCount: { 
    type: Number, 
    default: 0 
  },
  followingCount: { 
    type: Number, 
    default: 0 
  },
  postCount: { 
    type: Number, 
    default: 0 
  },
  tradeStats: {
    totalTrades: { type: Number, default: 0 },
    profitableTrades: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 }
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  role: { 
    type: String, 
    enum: ['user', 'moderator', 'admin'], 
    default: 'user' 
  },
  followers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  following: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  balance: { 
    type: Number, 
    default: 0 
  },
  change: { 
    type: Number, 
    default: 0 
  },
  esg: { 
    type: Number, 
    default: 0 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Hash password before saving if it's modified
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  if (this.password) {
    const bcrypt = await import('bcryptjs');
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  const bcrypt = await import('bcryptjs');
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", UserSchema);