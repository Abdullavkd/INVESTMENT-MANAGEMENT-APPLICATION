import { userModel } from "../model/user.js";
import bcrypt from 'bcrypt';
import mongoose from "mongoose";

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



// update role of any user
export const updateRole = async (req,res) => {
    try {
        // take user details from req.user
        const user = req.user;

        if(!user) {
            return res.status(404).json("There is no user found")
        }

        // check user role
        if(user.role != 'superAdmin') {
            return res.status(404).json("You can't change role of a user, Becauser you are not a Super Admin")
        }

        // take id from req.params
        const id = req.params.id;

        // check id
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).json("Id is not valid");
        }

        // check user existence and find
        const person = await userModel.findById(id);

        if(!person) {
            return res.status(404).json("There is no user with the provided id")
        }

        if(!req.body) {
            return res.status(404).json("There is no data on body")
        }

        // take data from body
        const {role} = req.body;

        if(!role) {
            return res.status(404).json("There is no role Provided")
        }

        // check current role
        if(role == 'superAdmin') {
            return res.status(404).json("You can't make anyone Super Admin");
        }

        if(person.role == role) {
            return res.status(404).json(`Already working with this role: ${role}`)
        }

        if(role != 'admin' && role != 'investor') {
            return res.status(404).json(`${role} role is not available`)
        }

        if(person.role == 'superAdmin') {
            return res.status(404).json("You can't change the role of Super Admin")
        }
        
        // update on database
        const updated = await userModel.findByIdAndUpdate(id,{$set:{role:role}},{new:true})

        // send response
        res.status(200).json({message:'Role Updated Successfully',user: updated})

    } catch (error) {
        res.status(error.status || 500).json(error.message || 'Something Went Wrong Updating')
    }
}







// get users list function
export const allUser = async (req,res) => {
    try {
        // take data from req.user
        if(!req.user) {
            return res.status(404).json("There is no data on req.user")
        }
        const user = req.user;

        // check role 
        if(user.role != 'superAdmin') {
            return res.status(404).json("You are not a Super Admin, so You can't get list of users")
        }

        // take data from body
        if(!req.body) {
            return res.status(404).json("There is no data on body")
        }
        const {role} = req.body;

        if(!role) {
            return res.status(404).json("There is no role in the body")
        }

        if(role != 'admin' && role != 'investor' && role != 'superAdmin') {
            return res.status(404).json("Please Select a valid role")
        }

        // find users with provided role
        const roleUsers = await userModel.find({role:role});

        // check is there users with provided role
        if(!roleUsers) {
            return res.status(404).json("There is no users with provided role")
        }

        // create list of provided role ,name and email
        const usersList = roleUsers.map((val) => {
            return {name:val.name, email:val.email}
        })

        // send Response
        res.status(200).json({role:role,users:usersList})
        
    } catch (error) {
        res.status(error.status || 500).json(error.message || 'Something Went Wrong geting list of users')
    }
}