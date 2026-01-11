import express from "express";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

const router = express.Router();

// const CSV_PATH = path.join(process.cwd(), "data", "Nifty50.csv");
const STOCKS_DIR = path.join(process.cwd(), "data", "nifty50");

let cache = [];

// // Load once into memory
// fs.createReadStream(CSV_PATH)
//   .pipe(csv())
//   .on("data", (row) => {
//     cache.push({
//       symbol: row.Symbol,
//       name: row.CompanyName || row.Symbol,
//       sector: row.Sector || "",
//     });
//   });

// router.get("/search", (req, res) => {
//   const q = (req.query.q || "").toLowerCase();
//   if (!q) return res.json([]);

//   const results = cache
//     .filter(
//       s =>
//         s.symbol.toLowerCase().includes(q) ||
//         s.name.toLowerCase().includes(q)
//     )
//     .slice(0, 10);

//   res.json(results);
// });


router.get("/search", (req, res) => {
  const q = req.query.q?.toUpperCase();
  if (!q) return res.json([]);

  const results = fs
    .readdirSync(STOCKS_DIR)
    .filter(f => f.endsWith(".csv"))
    .map(f => f.replace(".csv", ""))
    .filter(sym => sym.includes(q))
    .slice(0, 10)
    .map(sym => ({ symbol: sym, name: sym }));

  res.json(results);
});


export default router;
