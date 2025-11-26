import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { addInvestment, investListMy, listInvetsments } from '../controller/investment.js';

const investmentRouter = express.Router();

investmentRouter.post('/', verifyToken, addInvestment);
investmentRouter.get('/', verifyToken, listInvetsments);
investmentRouter.get('/my', verifyToken, investListMy);

export default investmentRouter;