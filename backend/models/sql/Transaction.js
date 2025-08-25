import express from 'express';
import pool from '../../config/mysql.js';
import PortfolioSQL from '../../models/sql/Portfolio.js';
import UserSQL from '../../models/sql/User.js'; // make sure your User model supports balance updates

const router = express.Router();

// Create a transaction (buy/sell)
router.post('/', async (req, res) => {
  const { userId, stockId, transactionType, quantity, price } = req.body;

  if (!userId || !stockId || !transactionType || !quantity || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Calculate total transaction value
    const totalValue = +(quantity * price).toFixed(2);

    // Get current balance
    const user = await UserSQL.getById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (transactionType === 'BUY' && user.balance < totalValue) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Start transaction
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // Insert transaction
      const [txResult] = await conn.query(
        `INSERT INTO transactions 
          (user_id, stock_id, transaction_type, quantity, price, total_value, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [userId, stockId, transactionType, quantity, price, totalValue]
      );

      // Update portfolio
      if (transactionType === 'BUY') {
        await PortfolioSQL.upsertHolding(userId, stockId, quantity, price);
        await UserSQL.updateBalance(userId, user.balance - totalValue);
      } else if (transactionType === 'SELL') {
        await PortfolioSQL.reduceHolding(userId, stockId, quantity);
        await UserSQL.updateBalance(userId, user.balance + totalValue);
      }

      await conn.commit();
      res.json({ success: true, transactionId: txResult.insertId });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;


// export default (sequelize, DataTypes) => {
//   const Transaction = sequelize.define("Transaction", {
//     id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     userId: DataTypes.INTEGER,
//     stockId: DataTypes.INTEGER,
//     type: { type: DataTypes.ENUM("buy", "sell") },
//     quantity: DataTypes.FLOAT,
//     price: DataTypes.FLOAT,
//     date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
//   });
//   return Transaction;
// };
