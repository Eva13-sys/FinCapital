// export default (sequelize, DataTypes) => {
//   const Portfolio = sequelize.define("Portfolio", {
//     id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     userId: DataTypes.INTEGER,
//     stockId: DataTypes.INTEGER,
//     quantity: DataTypes.FLOAT,
//     avgPrice: DataTypes.FLOAT,
//   });
//   return Portfolio;
// };

// const pool = require('../../config/mysql');

// const PortfolioSQL = {
//   async getByUserId(userId) {
//     const [rows] = await pool.query('SELECT * FROM portfolios WHERE user_id = ?', [userId]);
//     return rows;
//   }
// };

// module.exports = PortfolioSQL;
// backend/models/sql/Portfolio.js
import pool from '../../config/mysql.js';

const PortfolioSQL = {
  // Get all holdings for a user
  async getByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT p.id, p.user_id, p.stock_id, p.quantity, p.avg_price, s.ticker, s.current_price, s.company_id
       FROM portfolios p
       JOIN stocks s ON p.stock_id = s.id
       WHERE p.user_id = ?`,
      [userId]
    );
    return rows;
  },

  // Add or update a holding (used after a BUY transaction)
  async upsertHolding(userId, stockId, qty, price) {
    const [rows] = await pool.query(
      `SELECT * FROM portfolios WHERE user_id = ? AND stock_id = ?`,
      [userId, stockId]
    );

    if (rows.length > 0) {
      const portfolio = rows[0];
      const newQty = portfolio.quantity + qty;
      const newAvg =
        (portfolio.avg_price * portfolio.quantity + price * qty) / newQty;

      await pool.query(
        `UPDATE portfolios SET quantity = ?, avg_price = ?, updated_at = NOW() WHERE id = ?`,
        [newQty, newAvg, portfolio.id]
      );
    } else {
      await pool.query(
        `INSERT INTO portfolios (user_id, stock_id, quantity, avg_price) VALUES (?, ?, ?, ?)`,
        [userId, stockId, qty, price]
      );
    }
  },

  // Reduce or remove a holding (used after a SELL transaction)
  async reduceHolding(userId, stockId, qty) {
    const [rows] = await pool.query(
      `SELECT * FROM portfolios WHERE user_id = ? AND stock_id = ?`,
      [userId, stockId]
    );

    if (rows.length === 0) return;

    const portfolio = rows[0];
    const newQty = portfolio.quantity - qty;

    if (newQty <= 0) {
      await pool.query(`DELETE FROM portfolios WHERE id = ?`, [portfolio.id]);
    } else {
      await pool.query(
        `UPDATE portfolios SET quantity = ?, updated_at = NOW() WHERE id = ?`,
        [newQty, portfolio.id]
      );
    }
  },

  // Delete a holding completely
  async deleteHolding(userId, stockId) {
    await pool.query(
      `DELETE FROM portfolios WHERE user_id = ? AND stock_id = ?`,
      [userId, stockId]
    );
  }
};
export default PortfolioSQL;
