// export default (sequelize, DataTypes) => {
//     const User =  sequelize.define("User", {
//         id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//         name: DataTypes.STRING,
//         email: { type: DataTypes.STRING, unique: true},
//         password: DataTypes.STRING, 
//     })
//     return User;
// };

// const pool = require('../../config/mysql');

// const UserSQL = {
//   async getUserById(id) {
//     const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
//     return rows[0];
//   },

//   async createUser({ name, email, password }) {
//     const [result] = await pool.query(
//       'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//       [name, email, password]
//     );
//     return { id: result.insertId, name, email };
//   }
// };

// module.exports = UserSQL;
// backend/models/sql/User.js
import pool from "../../config/mysql.js";

const UserSQL = {
  async getById(userId) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [userId]);
    return rows[0];
  },

  async updateBalance(userId, newBalance) {
    await pool.query(`UPDATE users SET balance = ? WHERE id = ?`, [newBalance, userId]);
  }
};

export default UserSQL;
