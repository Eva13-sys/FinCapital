import express from 'express';
import transactionController from '../controllers/sql/transactionController.js';

const router = express.Router();

router.post('/', transactionController.createTransaction);
router.get('/:userId', transactionController.getTransactionsByUser);

export default router;
