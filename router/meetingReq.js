import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { newMeetingReq } from '../controller/meetingReq.js';

const meetingReqRouter = express.Router();

meetingReqRouter.post('/:opportunityId', verifyToken, newMeetingReq)


export default meetingReqRouter;