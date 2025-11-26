import mongoose from "mongoose";
import { investmentOppModel } from "../model/inverstmentOpp.js";
import { meetingReqModel } from "../model/meetingReq.js";


export const newMeetingReq = async (req, res) => {
    try {
        // check role
        const user = req.user;
        if(!user) {
            return res.status(404).json("There is no user")
        }
        if(user.role != 'investor') {
            return res.status(404).json("You are not an Investor")
        }

        if(!req.body) {
            return res.status(404).json("There is no content on body")
        }

        // take data from body
        const {prefferedDate, message} = req.body;

        if(!prefferedDate || !message) {
            return res.status(404).json("prefferedDate and message are Required")
        }

        // take opportunityId from params
        const opportunityId = req.params.opportunityId;

        if(!opportunityId) {
            return res.status(404).json("There is no opportunityId")
        }
        if(!mongoose.Types.ObjectId.isValid(opportunityId)) {
            return res.status(404).json("Invalid opportunityId")
        }

        // find opportunity from database
        const opportunity = await investmentOppModel.findOne({_id:opportunityId});

        if(!opportunity) {
            return res.status(404).json("There is no opportunity With provided Id")
        }

        // take investorId from user
        const investorId = user._id;

        // save to database
        const meetingReq = new meetingReqModel({
            prefferedDate,
            message,
            investorId,
            opportunityId
        });
        await meetingReq.save();

        // send response
        res.status(201).json({
            message:"Requested a meeting Successfully",
            details:{
                prefferedDate,
                message,
                investorId,
                opportunityId
            }
        })
    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something Went Wrong Rquesting a Meeting")
    }
}