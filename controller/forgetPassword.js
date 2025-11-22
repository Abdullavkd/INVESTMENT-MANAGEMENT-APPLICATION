import { userModel } from "../model/user.js";

export const forgetPassword = async (req,res) => {
    try{
        // take data from body
        const email = req.body;

        if(!email) {
            return res.status(404).json("There in no email provided");
        }

        // check user existence
        const user = await userModel.findOne({email:email});

        if(!user) {
            return res.status(404).json("There is no user with this email id")
        }

        // create a randon six digit code to reset password
        const otp = Math.floor(100000 + Math.random() * 900000);

        // send password reset otp to mail
        const info = await sendMail({
            email,
            subject:"Reset Password",
            opt:otp
        });

        // send response
        res.status(201).json("Otp Send to Your Email")
    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something Went Wrong on Resetting Password")
    }

}