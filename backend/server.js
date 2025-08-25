// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/mysql.js';
import connectMongo from './config/mongo.js';

// Routes
import authRoutes from './routes/auth.js';
import chartRoutes from './routes/chart.js';
import statsRoutes from './routes/stats.js';
import companyRoutes from './routes/companies.js';
import esgRoutes from './routes/esg.js';
import stocksRoutes from './routes/stocks.js';  // ✅ correct if file is here
import portfolioRoutes from './routes/portfolio.js';
import transactionRoutes from './routes/transactions.js';
import leftPanelRoutes from './routes/leftPanel.js';
import goalsRoutes from './routes/goals.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

connectMongo();

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// mysql connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('MySQL connected');
    conn.release();
  } catch (err) {
    console.error('MySQL connection error:', err);
  }
})();

app.use('/api/auth', authRoutes);
app.use('/api/chart', chartRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/companies', companyRoutes); 
app.use('/api/esg', esgRoutes);
app.use('/api/stocks', stocksRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/leftpanel', leftPanelRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use("/api/goals", goalsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
