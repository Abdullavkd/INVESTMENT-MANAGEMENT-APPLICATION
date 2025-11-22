import express from 'express';
import { loginAll } from '../controller/login.js';
import { userRegister } from '../controller/register.js';

const authRouter = express.Router();

authRouter.post('/login',loginAll);
authRouter.post('/register-investor',userRegister);

export default authRouter;