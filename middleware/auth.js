import jwt from 'jsonwebtoken';
import { userModel } from '../model/user.js';

export const verifyToken = async (req,res,next) => {
    try {
        // collect token from req.header
        const authHead = req.headers.authorization;

        if(!authHead) {
            return res.status(404).json("No token Provided");
        }

        // remove Bearer
        const token = authHead.split(" ")[1];

        // Assure existence of secret key
        if(!process.env.SECRET_KEY) {
            return res.status(404).json("There is no Secret Key");
        }

        // collect user details from token
        const data = jwt.verify(token,process.env.SECRET_KEY);

        // find user details
        const user = await userModel.findById(data.id);

        // check user existence
        if(!user) {
            return res.status(404).json("the user no longer available")
        }

        req.user = user;
        next()
    } catch (error) {
        res.status(error.status || 500).json(error.message || "Token can't Verfity");
    }
}