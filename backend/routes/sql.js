// import express from "express";
// // import db from "../models/sql/index.js";
// import pool from '../config/mysql.js';

// const { User, Stock, Portfolio, Transaction } = db;
// const router = express.Router();

// //users
// router.post("/users", async (req, res) => {
//   const user = await User.create(req.body);
//   res.json(user);
// });

// const FALLBACK = [
//   { symbol: "TCS", name: "Tata Consultancy Services", esg: true },
//   { symbol: "INFY", name: "Infosys", esg: true },
//   { symbol: "RELIANCE", name: "Reliance Industries", esg: false }
// ];
// //stocks
// router.get('/stocks', async (req, res) => {
//   try {
//     if (!pool) {
//       return res.json(FALLBACK);
//     }
//     const [rows] = await pool.query('SELECT symbol, name, esg FROM stocks LIMIT 500');
//     // normalize rows
//     const out = (rows || []).map(r => ({
//       symbol: (r.symbol || r.symbol_code || '').toString(),
//       name: r.name || r.company_name || '',
//       esg: !!r.esg,
//     }));
//     return res.json(out.length ? out : FALLBACK);
//   } catch (err) {
//     console.error("sql/stocks error:", err);
//     return res.json(FALLBACK);
//   }
// });

// //portfolio
// router.get("/portfolio/:userId", async (req, res) => {
//   const portfolio = await Portfolio.findAll({ where: { userId: req.params.userId } });
//   res.json(portfolio);
// });

// // transactions
// router.post("/transaction", async (req, res) => {
//   const tx = await Transaction.create(req.body);
//   res.json(tx);
// });

// export default router;
// ...existing code...
import express from "express";
import pool from "../config/mysql.js";

const router = express.Router();

const FALLBACK = [
  { symbol: "TCS", name: "Tata Consultancy Services", esg: true },
  { symbol: "INFY", name: "Infosys", esg: true },
  { symbol: "RELIANCE", name: "Reliance Industries", esg: false }
];

// Helper: safe JSON body -> insert into table
async function insertIntoTable(connOrPool, table, obj) {
  const keys = Object.keys(obj || {});
  if (!keys.length) {
    const [res] = await connOrPool.execute(`INSERT INTO \`${table}\` () VALUES ()`);
    return res;
  }
  const cols = keys.map(k => `\`${k}\``).join(", ");
  const placeholders = keys.map(() => "?").join(", ");
  const values = keys.map(k => obj[k]);
  const [res] = await connOrPool.execute(`INSERT INTO \`${table}\` (${cols}) VALUES (${placeholders})`, values);
  return res;
}

// POST /api/sql/users  -> create user (best-effort)
router.post("/users", async (req, res) => {
  try {
    if (!pool) throw new Error("No SQL pool");
    const result = await insertIntoTable(pool, "users", req.body);
    const insertId = result.insertId;
    const [rows] = await pool.query("SELECT * FROM `users` WHERE id = ?", [insertId]);
    return res.json(rows[0] || { id: insertId, ...req.body });
  } catch (err) {
    console.error("sql/users error:", err);
    // fallback: echo request
    return res.status(200).json({ id: null, ...req.body, _fallback: true });
  }
});

// GET /api/sql/stocks
router.get("/stocks", async (req, res) => {
  try {
    if (!pool) return res.json(FALLBACK);
    const [rows] = await pool.query("SELECT symbol, name, esg FROM stocks LIMIT 500");
    const out = (rows || []).map(r => ({
      symbol: (r.symbol || r.symbol_code || "").toString(),
      name: r.name || r.company_name || "",
      esg: !!r.esg,
    }));
    return res.json(out.length ? out : FALLBACK);
  } catch (err) {
    console.error("sql/stocks error:", err);
    return res.json(FALLBACK);
  }
});

// GET /api/sql/portfolio/:userId
router.get("/portfolio/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!pool) throw new Error("No SQL pool");
    const [rows] = await pool.query("SELECT * FROM portfolio WHERE userId = ?", [userId]);
    return res.json(rows || []);
  } catch (err) {
    console.error("sql/portfolio error:", err);
    return res.status(200).json([]); // safe fallback
  }
});

// POST /api/sql/transaction
// body: { userId, symbol, type: 'buy'|'sell', qty, price }
// This inserts a transaction and updates portfolio accordingly (best-effort).
router.post("/transaction", async (req, res) => {
  const { userId, symbol, type, qty, price } = req.body || {};
  if (!userId || !symbol || !type || !qty || !price) {
    return res.status(400).json({ error: "Missing required fields: userId, symbol, type, qty, price" });
  }

  if (!pool) {
    console.warn("No SQL pool - returning fallback transaction");
    return res.status(200).json({ id: null, ...req.body, _fallback: true });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // insert transaction
    const txCols = ["userId", "symbol", "type", "qty", "price", "createdAt"];
    const txValues = [userId, symbol, type, qty, price, new Date()];
    const placeholders = txCols.map(() => "?").join(", ");
    const [txResult] = await conn.execute(
      `INSERT INTO transactions (${txCols.join(", ")}) VALUES (${placeholders})`,
      txValues
    );

    // update portfolio
    const [portfolioRows] = await conn.execute(
      "SELECT id, qty, avgCost FROM portfolio WHERE userId = ? AND symbol = ? FOR UPDATE",
      [userId, symbol]
    );

    const existing = (portfolioRows && portfolioRows[0]) || null;

    if (type.toLowerCase() === "buy") {
      if (!existing) {
        // insert new portfolio row
        const [ins] = await conn.execute(
          "INSERT INTO portfolio (userId, symbol, qty, avgCost) VALUES (?, ?, ?, ?)",
          [userId, symbol, qty, price]
        );
      } else {
        const existQty = Number(existing.qty) || 0;
        const existAvg = Number(existing.avgCost) || 0;
        const newQty = existQty + Number(qty);
        const newAvg = ((existAvg * existQty) + (Number(price) * Number(qty))) / newQty;
        await conn.execute(
          "UPDATE portfolio SET qty = ?, avgCost = ? WHERE id = ?",
          [newQty, newAvg, existing.id]
        );
      }
    } else if (type.toLowerCase() === "sell") {
      if (!existing) {
        // nothing to sell
        await conn.rollback();
        return res.status(400).json({ error: "No holdings to sell" });
      }
      const existQty = Number(existing.qty) || 0;
      if (Number(qty) > existQty) {
        await conn.rollback();
        return res.status(400).json({ error: "Sell quantity exceeds holdings" });
      }
      const newQty = existQty - Number(qty);
      if (newQty === 0) {
        await conn.execute("DELETE FROM portfolio WHERE id = ?", [existing.id]);
      } else {
        await conn.execute("UPDATE portfolio SET qty = ? WHERE id = ?", [newQty, existing.id]);
      }
    } else {
      // unknown type
      await conn.rollback();
      return res.status(400).json({ error: "Unknown transaction type" });
    }

    await conn.commit();

    // fetch inserted transaction
    const [txRow] = await pool.query("SELECT * FROM transactions WHERE id = ?", [txResult.insertId]);
    return res.json(txRow[0] || { id: txResult.insertId, ...req.body });
  } catch (err) {
    if (conn) {
      try { await conn.rollback(); } catch (e) {}
    }
    console.error("sql/transaction error:", err);
    return res.status(500).json({ error: "Transaction failed", detail: err.message });
  } finally {
    if (conn) conn.release();
  }
});

export default router;