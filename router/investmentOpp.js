import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { deleteInvestOpp, getOpportunityDetails, investOpp, listInvestOpp, updateInvestmentOpp } from '../controller/investmentOpp.js';

const investmentOppRouter = express.Router();

investmentOppRouter.post('/', verifyToken, investOpp);
investmentOppRouter.put('/:id', verifyToken, updateInvestmentOpp);
investmentOppRouter.delete('/:id', verifyToken, deleteInvestOpp);
investmentOppRouter.get('/', verifyToken, listInvestOpp)
investmentOppRouter.get('/:id', verifyToken, getOpportunityDetails)


export default investmentOppRouter;