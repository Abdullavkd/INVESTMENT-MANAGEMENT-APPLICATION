import { userModel } from "../model/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginAll = async (req,res) => {
    try {
        // take data from body
        const {email, password} = req.body;

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
        res.status(201).json(`Logined Successfully`, {name:user.name,email:user.email,role:user.role,token:`Bearer ${token}`});

    } catch (error) {
        res.status(error.status || 500).json(error.message || "Error")
    }
}