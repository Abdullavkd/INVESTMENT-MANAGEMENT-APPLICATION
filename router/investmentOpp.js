import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { deleteInvestOpp, investOpp, updateInvestmentOpp } from '../controller/investmentOpp.js';

const investmentOppRouter = express.Router();

investmentOppRouter.post('/', verifyToken, investOpp);
investmentOppRouter.put('/:id', verifyToken, updateInvestmentOpp);
investmentOppRouter.delete('/:id', verifyToken, deleteInvestOpp)

export default investmentOppRouter;