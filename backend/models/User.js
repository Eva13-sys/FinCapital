import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true, sparse: true },
  email: { type: String, required: true },
  password: { type: String}, 

  balance: { type: Number, default: 0 },
  change: { type: Number, default: 0 },
  esg: { type: Number, default: 0 }
});

export default mongoose.model("User", UserSchema);