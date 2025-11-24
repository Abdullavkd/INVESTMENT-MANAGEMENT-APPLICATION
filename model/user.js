import mongoose, { model } from 'mongoose';

const restePasswordSchema = new mongoose.Schema({
    otpHash: {
        type:String
    },
    expiresAt: {
        type:Number
    },
    attempts: {
        type:Number,
        default:0
    }
},{
    _id:false
})

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"User's Full Name"]
    },
    email:{
        type:String,
        required:[true,"User's Email Address(used for login)"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Password Is Required"]
    },
    role:{
        type:String,
        required:true
    },
    phone:{
        type:Number
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    restePassword:restePasswordSchema
})

export const userModel = mongoose.model("user",userSchema);