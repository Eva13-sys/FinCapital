// export default (sequelize, DataTypes) => {
//   const Stock = sequelize.define("Stock", {
//     id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     ticker: { type: DataTypes.STRING, unique: true },
//     name: DataTypes.STRING,
//     sector: DataTypes.STRING,
//     price: DataTypes.FLOAT,
//     marketCap: DataTypes.FLOAT,
//   });
//   return Stock;
// };
import pool from '../../config/mysql.js';

// Stock model
const Stock = {
  async create({ symbol, name, exchange, currency }) {
    const [result] = await pool.query(
      `INSERT INTO stocks (symbol, name, exchange, currency) 
       VALUES (?, ?, ?, ?)`,
      [symbol, name, exchange, currency]
    );
    return { id: result.insertId, symbol, name, exchange, currency };
  },

  async findById(id) {
    const [rows] = await pool.query(`SELECT * FROM stocks WHERE id = ?`, [id]);
    return rows[0];
  },

  async findBySymbol(symbol) {
    const [rows] = await pool.query(`SELECT * FROM stocks WHERE symbol = ?`, [symbol]);
    return rows[0];
  },

  async findAll() {
    const [rows] = await pool.query(`SELECT * FROM stocks`);
    return rows;
  }
};

export default Stock;
