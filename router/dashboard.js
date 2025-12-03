import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getDashboardSummary, getOpportunity, investorProfile, investorsStats } from '../controller/dashboard.js';

const dashboardRouter = express.Router()

dashboardRouter.get('/summary', verifyToken, getDashboardSummary);
dashboardRouter.get('/investors', verifyToken, investorsStats);
dashboardRouter.get('/investors/:investorId', verifyToken, investorProfile);
dashboardRouter.get('/opportunities/performance', verifyToken, getOpportunity);


export default dashboardRouter;