import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { addInvestment } from '../controller/investment.js';

const investmentRouter = express.Router();

investmentRouter.post('/', verifyToken, addInvestment)

export default investmentRouter;