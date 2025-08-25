import express from 'express';
import stockController from '../controllers/sql/stockController.js';

const router = express.Router();

router.post('/', stockController.addStock);
router.get('/', stockController.getAllStocks);

export default router;
