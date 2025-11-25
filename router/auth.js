import express from 'express';
import { adminRegister, forgetPassword, loginAll, userRegister } from '../controller/auth.js';
import { verifyToken } from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post('/login',loginAll);
authRouter.post('/register-investor',userRegister);
authRouter.post('/forgot-password',forgetPassword);
authRouter.post('/create-admin',verifyToken,adminRegister);

export default authRouter;