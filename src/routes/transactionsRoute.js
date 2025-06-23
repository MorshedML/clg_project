import express from 'express';

const router = express.Router();
import { getTransactionsById , createTransaction, deleteTransaction, getTransactionsSummary } from '../controllers/transactionsController.js';

router.get('/:userId', getTransactionsById);



router.post('/', createTransaction);


router.delete('/:id', deleteTransaction);

router.get('/summary/:userId', getTransactionsSummary);


export default router;