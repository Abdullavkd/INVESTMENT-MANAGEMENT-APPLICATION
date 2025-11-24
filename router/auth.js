import express from 'express';
import { loginAll } from '../controller/login.js';
import { userRegister } from '../controller/register.js';
import { forgetPassword } from '../controller/forgetPassword.js';

const authRouter = express.Router();

authRouter.post('/login',loginAll);
authRouter.post('/register-investor',userRegister);
authRouter.post('/forgot-password',forgetPassword);

export default authRouter;