import express from 'express';
import { loginAll } from '../controller/login.js';

const authRouter = express.Router();

authRouter.post('/login',loginAll);

export default authRouter;