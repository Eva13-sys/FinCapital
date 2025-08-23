import mongoose from 'mongoose';

const WatchlishSchema = new mongoose.Schema({
    userId: { type: String, required:true },

})