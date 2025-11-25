import { userModel } from "../model/user.js";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { sendMail } from "../util/sendMail.js";
import crypto from 'crypto'

export const userRegister = async (req,res) => {
    try {
        // take data from body
        const {name, email, password, phone} = req.body;

        if(!name || !email || !password || !phone) {
            return res.status(404).json("name, email, password and phone are Required");
        }
        

        // is user exist
        const isExist = await userModel.findOne({email:email});

        if(isExist) {
            return res.status(404).json("User already exist with the email id")
        }

        // bcrypt password
        const bcryptedPass = await bcrypt.hash(password,10);

        // create variable for role and createdAt
        let role;
        let createdAt;

        // save user to database
        const newUser = new userModel({
            name,
            email,
            password:bcryptedPass,
            role:"investor",
            phone,
            createdAt:new Date()
        })
        await newUser.save();

        // send response
        res.status(201).json({message:'Account Created Successfully',
            user:{
                name,
                email,
                password,
                role,
                phone,
                createdAt
            }
        });


    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something Went Wrong on Creating Account")
    }
};







// admin register function
export const adminRegister = async (req,res) => {
    try {
        // take user details from req.user
        const user = req.user;

        if(!user) {
            return res.status(404).json("There is no user")
        }

        if(user.role != 'superAdmin') {
            return res.status(404).json("You are not a Super Admin, so You can't create admin account");
        }

        // take data from body
        let {name, email, password ,phone, role} = req.body;

        if(!name || !email || !phone) {
            return res.status("name, email and phone number are required")
        }

        // check user existense
        const isExist = await userModel.findOne({email:email});
        
        if(isExist) {
            return res.status(404).json("User Exists");
        }

        // is there no password, create random password
        if(!password) {
            password = String(Math.floor(10000000 + Math.random() * 90000000))
        }

        // isn't there a role, set as admin. is there a role except admin or user make an error
        if(!role) {
            role = 'admin';
        }else if(role != 'admin' && role != 'investor') {
            return res.status(404).json("You can only create account for admins and users")
        }

        // bcrypt password
        const hashPass = await bcrypt.hash(password,10);

        // save to database
        const newUser = new userModel({
            name,
            email,
            password:hashPass,
            role,
            phone,
            createdAt: Date.now()
        });
        await newUser.save();

        // send response
        res.status(201).json({message:'Admin Acoount Created Successfully',
            user:{
                name,
                email,
                password,
                role,
                phone,
                createdAt: Date.now()
            }}
        );
    } catch (error) {
        res.status(error.status || 500).json(error.message || 'Something error on creating admin account')
    }
}











export const loginAll = async (req,res) => {
    try {
        // take data from body
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(404).json("email and password are required")
        }

        // check is there an account with the provided data
        const user = await userModel.findOne({email:email});

        if(!user) {
            return res.status(404).json("There is No User with This email");
        }

        // check password
        const isMatchPass = await bcrypt.compare(password,user.password);

        if(!isMatchPass) {
            return res.status(404).json("Incurrect Password")
        }

        // create JWT
        const token = jwt.sign(
            {id:user._id},
            process.env.SECRET_KEY,
        );

        if(!token) {
            return res.status(404).json("Something Went Wrong!")
        }
        
        // send response
        res.status(201).json({name:user.name,email:user.email,role:user.role,token:`Bearer ${token}`});

    } catch (error) {
        res.status(error.status || 500).json(error.message || "Error")
    }
};















// forget password function
export const forgetPassword = async (req,res) => {
    try{
        // take data from body
        const email = req.body;

        if(!email) {
            return res.status(404).json("There in no email provided");
        }

        // check user existence
        const user = await userModel.findOne({email:email.email});

        if(!user) {
            return res.status(404).json("There is no user with this email id")
        }

        // create a randon six digit code to reset password
        const otp = Math.floor(100000 + Math.random() * 900000);

        // send password reset otp to mail
        const info = await sendMail({
            email:email.email,
            subject:"Reset Password",
            otp:otp
        });

        // otp expiration
        const OTP_TTL_MINUTES = 10;
        const expiresAt = Date.now() + OTP_TTL_MINUTES * 60 * 1000;

        // hash otp
        const otpHash = crypto.createHash("sha256").update(String(otp)).digest("hex");

        // save to mongoDB
        user.restePassword = new userModel({
            otpHash,
            expiresAt
        })
        await user.save();

        // send response
        res.status(201).json("Otp Send to Your Email");
    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something Went Wrong on Resetting Password")
    }

}