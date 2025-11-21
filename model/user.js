import mongoose, { model } from 'mongoose';

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
        type:Date
    }
})

export const userModel = mongoose.model("user",userSchema);