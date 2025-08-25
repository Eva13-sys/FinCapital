import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DB || 'trading_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
//   process.env.MYSQL_DB,
//   process.env.MYSQL_USER,
//   process.env.MYSQL_PASS,
//   {
//     host: process.env.MYSQL_HOST,
//     dialect: "mysql",
//     logging: false,
//   }
// );

// const connectMySQL = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("MySQL connected");
//   } catch (error) {
//     console.error("MySQL connection failed:", error);
//     process.exit(1);
//   }
// };

// module.exports = { sequelize, connectMySQL };
