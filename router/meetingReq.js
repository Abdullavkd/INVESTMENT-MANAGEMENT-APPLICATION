import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { listMeetingReq, newMeetingReq, updateStatusMeeting } from '../controller/meetingReq.js';

const meetingReqRouter = express.Router();

meetingReqRouter.post('/:opportunityId', verifyToken, newMeetingReq);
meetingReqRouter.get('/', verifyToken, listMeetingReq);
meetingReqRouter.put('/:id', verifyToken, updateStatusMeeting);


export default meetingReqRouter;