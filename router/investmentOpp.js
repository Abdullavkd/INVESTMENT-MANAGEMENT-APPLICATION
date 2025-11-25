import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { investOpp } from '../controller/investmentOpp.js';

const investmentOppRouter = express.Router();

investmentOppRouter.post('/', verifyToken, investOpp);

export default investmentOppRouter;