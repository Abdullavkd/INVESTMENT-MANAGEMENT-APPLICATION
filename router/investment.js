import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { addInvestment, listInvetsments } from '../controller/investment.js';

const investmentRouter = express.Router();

investmentRouter.post('/', verifyToken, addInvestment);
investmentRouter.get('/', verifyToken, listInvetsments)

export default investmentRouter;