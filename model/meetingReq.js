import mongoose, { Schema } from 'mongoose';

const meetingReqSchema = mongoose.Schema({
    investorId:{
        type: Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Investor Id is Required"],
        index:true
    },
    opportunityId:{
        type:Schema.Types.ObjectId,
        ref:"investmentOpp",
        required:[true,"Opportunity Id is Required"],
        index:true
    },
    prefferedDate:{
        type:Date
    },
    message:{
        type:String
    },
    status:{
        type:String,
        enum:['Pending','Scheduled','Rejected'],
        default:'Pending'
    },
    scheduledData:{
        type:Date
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});

export const meetingReqModel = mongoose.model("meetingReq",meetingReqSchema);