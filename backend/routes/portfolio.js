import express from 'express';
import pool from '../config/mysql.js';
import PortfolioSQL from '../models/sql/Portfolio.js';
import StockSQL from '../models/sql/Stock.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const holdings = await PortfolioSQL.getByUserId(userId);
    if (!holdings.length) return res.json({ rows: [], totalValue: 0, totalPnl: 0 });

    const stockIds = holdings.map(h => h.stock_id);
    const stocks = await StockSQL.getByIds(stockIds);

    const rows = holdings.map(h => {
      const stock = stocks.find(s => s.id === h.stock_id);
      const currentPrice = stock?.current_price || 0;
      const value = +(h.quantity * currentPrice).toFixed(2);
      const cost = +(h.quantity * h.avg_price).toFixed(2);
      const pnl = +(value - cost).toFixed(2);
      const pnlPct = cost ? +((pnl / cost) * 100).toFixed(2) : 0;

      return {
        stockId: h.stock_id,
        ticker: stock?.ticker || '',
        name: stock?.name || '',
        quantity: h.quantity,
        avgPrice: h.avg_price,
        currentPrice,
        value,
        pnl,
        pnlPct
      };
    });

    const totalValue = rows.reduce((acc, r) => acc + r.value, 0).toFixed(2);
    const totalPnl = rows.reduce((acc, r) => acc + r.pnl, 0).toFixed(2);

    res.json({ rows, totalValue: +totalValue, totalPnl: +totalPnl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
