import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { investOpp, updateInvestmentOpp } from '../controller/investmentOpp.js';

const investmentOppRouter = express.Router();

investmentOppRouter.post('/', verifyToken, investOpp);
investmentOppRouter.put('/:id', verifyToken, updateInvestmentOpp)

export default investmentOppRouter;