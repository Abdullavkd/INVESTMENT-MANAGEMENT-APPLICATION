import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { adminRegister, allUser, updateRole, userRegister } from '../controller/register.js';

const superAdminRouter = express.Router();

superAdminRouter.post('/create-admin',verifyToken,adminRegister);
superAdminRouter.put('/users/:id/role',verifyToken,updateRole)
superAdminRouter.get('/users',verifyToken,allUser)

export default superAdminRouter;