import pool from '../../config/mysql.js';

// Add new stock
const addStock = async (req, res) => {
  const { ticker, name, sector, price } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO stock (ticker, name, sector, price) VALUES (?, ?, ?, ?)',
      [ticker, name, sector, price]
    );
    res.status(201).json({ message: 'Stock added successfully', stockId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error adding stock' });
  }
};

// Get all stocks
const getAllStocks = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM stock');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error fetching stocks' });
  }
};

export default { addStock, getAllStocks };
