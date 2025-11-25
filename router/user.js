import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { allUser, updateRole } from '../controller/user.js';

const userRouter = express.Router();

userRouter.put('/users/:id/role', verifyToken, updateRole)
userRouter.get('/users', verifyToken, allUser)

export default userRouter;