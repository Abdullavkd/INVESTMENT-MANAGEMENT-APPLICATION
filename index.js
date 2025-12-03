import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './router/auth.js';
import userRouter from './router/user.js';
import investmentOppRouter from './router/investmentOpp.js';
import investmentRouter from './router/investment.js';
import meetingReqRouter from './router/meetingReq.js';
import dashboardRouter from './router/dashboard.js';

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.use(express.json());

app.use('/api/auth',authRouter);
app.use('/api/admin',userRouter);
app.use('/api/opportunities',investmentOppRouter);
app.use('/api/investments', investmentRouter);
app.use('/api/requests', meetingReqRouter)
app.use('/api/dashboard', dashboardRouter)


const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/investmentProject';
async function start(){
    try {
        await mongoose.connect(MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("MongoDB Connected");
        app.listen(PORT,() => {
            console.log(`Server is Running on Port ${PORT}`)
        })
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};
start();