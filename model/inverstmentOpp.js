import mongoose from 'mongoose';

const investmentOppSchema = mongoose.Schema({
    companyName:{
        type:String,
        required:[true,"Company Name is Required"]
    },
    equityDetails:{
        type:String,
        required:[true,"Equity Details is Required"]
    },
    targetPrice:{
        type:Number,
        required:[true,"Target Price is Required"]
    },
    returnPercentage:{
        type:Number,
        required:[true,"Return Percentage is Required"]
    },
    minInvestment:{
        type:Number,
        default:0
    },
    postedBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
        index: true
    },
    status:{
        type:String
    }
},
{
    timestamps:true
}
);

export const investmentOppModel = Schema.model("investmentOpp",investmentOppSchema)