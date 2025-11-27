import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { listMeetingReq, newMeetingReq } from '../controller/meetingReq.js';

const meetingReqRouter = express.Router();

meetingReqRouter.post('/:opportunityId', verifyToken, newMeetingReq);
meetingReqRouter.get('/', verifyToken, listMeetingReq);


export default meetingReqRouter;