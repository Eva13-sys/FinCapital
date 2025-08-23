import mongoose from 'mongoose';

const WatchlishSchema = new mongoose.Schema({
    userId: { type: String, required:true },
    name : { type: String, default: "Default Watchlist"},
    stocks : [{ ticker: String, notes: String}],
})