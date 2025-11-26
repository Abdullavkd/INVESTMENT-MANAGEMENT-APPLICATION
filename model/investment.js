import mongoose from "mongoose";

const investmentSchema = mongoose.Schema({
    investorId:{
        type:Schema.Types.ObjectId,
        ref:"user",
        required:[true,"Investor Id is Required"]
    },
    opportunityId:{
        type:Schema.Types.ObjectId,
        ref:"investmentOpp",
        required:[true,"Investment Id is Required"]
    },
    amount:{
        type:Number,
        required:[true,'Amout is Required']
    },
    sharesOrUnits:{
        type:Number,
        required:[true,"Shares or Units are Required"]
    },
    transactionDate:{
        type:Date
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

export const investmentModel = mongoose.model("investment",investmentSchema);