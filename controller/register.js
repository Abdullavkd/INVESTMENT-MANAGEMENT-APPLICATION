import { userModel } from "../model/user.js";
import bcrypt from 'bcrypt';

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

        // save user to database
        const newUser = new userModel({
            name,
            email,
            password:bcryptedPass,
            role:"user",
            phone,
            createdAt
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