// server.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
// MySQL removed: pool import deleted
import connectMongo from './config/mongo.js';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import meRoutes from './routes/me.js';
import chartRoutes from './routes/chart.js';
import statsRoutes from './routes/stats.js';
import companyRoutes from './routes/companies.js';
import esgWatchlistRoutes from "./routes/esg_watchlist.js";
// import esgRoutes from './routes/esg.js';
import stocksRoutes from './routes/stocks.js';
import portfolioRoutes from './routes/portfolio.js';
import marketRoutes from './routes/market.js';
import transactionRoutes from './routes/transactions.js';
import leftPanelRoutes from './routes/leftPanel.js';
import tradingSearchRouter from './routes/tradingSearch.js';
import finnhubRoutes from "./routes/finnhub.js";
import finnhubCandles from "./routes/finnhubCandles.js";
import yahooCandles from "./routes/yahooCandles.js";

import replayRoutes from "./routes/replay.js";
import goalsRoutes from './routes/goals.js';
import walletRoutes from './routes/wallet.js';
import mentorRoutes from "./routes/mentor.js";

// Community Routes
import postsRoutes from './routes/posts.js';
import usersRoutes from './routes/users.js';
import notificationsRoutes from './routes/notifications.js';


// Add Sentiment Route
import sentimentRoutes from './routes/sentiment.js';

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectMongo();

// MySQL connection removed.

// API Routes
app.use('/api/me', meRoutes);
app.use('/api/chart', chartRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/companies', companyRoutes);
app.use("/api/esg-watchlist", esgWatchlistRoutes);
// app.use('/api/esg', esgRoutes);
app.use('/api/stocks', stocksRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/leftpanel', leftPanelRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/trading", tradingSearchRouter);
app.use("/api/finnhub", finnhubRoutes);
app.use("/api/finnhub", finnhubCandles);
app.use("/api/yahoo", yahooCandles);
app.use("/api/replay", replayRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/mentor", mentorRoutes);
// SQL routes removed (MySQL removed).

// Community Routes
app.use('/api/posts', postsRoutes);
app.use('/api/chat', usersRoutes);
app.use('/api/notifications', notificationsRoutes);


// Add Sentiment Routes
app.use('/api/sentiment', sentimentRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const axios = (await import('axios')).default;
    const aiHealth = await axios.get(`${process.env.AI_SERVICE_URL}/api/health`)
      .then(response => ({ status: 'connected', data: response.data }))
      .catch(error => ({ status: 'disconnected', error: error.message }));

    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      services: {
        mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        mysql: 'connected',
        aiService: aiHealth
      }
    });
  } catch (error) {
    res.json({
      status: 'PARTIAL',
      timestamp: new Date().toISOString(),
      services: {
        mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        mysql: 'connected',
        aiService: { status: 'check failed', error: error.message }
      }
    });
  }
});


// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
})

app.use('/*splat', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`AI Service: ${process.env.AI_SERVICE_URL}`);
  console.log(`Frontend: ${process.env.FRONTEND_URL}`);
});