import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()

// create transported to create transport( it is common thing to do as compalsary )
// it collects everything need to send mail
const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:Number(process.env.SMTP_PORT) || 587,
    secure:Number(process.env.SMTP_PORT) === 465,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    }
});


// verify SMTP Connection
transporter.verify()
.then(() => console.log("SMTP Ready"))
.catch((error) => console.log(`SMTP Verify Failed: ${error.message}`));

// create sendMail function to send mail
export async function sendMail(options) {
    const mailOptions = {
        from:process.env.FROM_EMAIL,
        to:options.email,
        subject:"Reset Password",
        text:String(options.otp) || "No Message",
    };

    // write email sender (it sends email) (sendMail is a function of nodemailer)
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
};