import pool from '../../config/mysql.js';

// Create a transaction (buy/sell)
const createTransaction = async (req, res) => {
  const { user_id, stock_id, type, quantity, price } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO transaction (user_id, stock_id, type, quantity, price) VALUES (?, ?, ?, ?, ?)',
      [user_id, stock_id, type, quantity, price]
    );
    res.status(201).json({ message: 'Transaction added successfully', transactionId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error creating transaction' });
  }
};

// Get transactions by user
const getTransactionsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.type, t.quantity, t.price, s.ticker, s.name, t.created_at
       FROM transaction t
       JOIN stock s ON t.stock_id = s.id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error fetching transactions' });
  }
};

export default { createTransaction, getTransactionsByUser };

