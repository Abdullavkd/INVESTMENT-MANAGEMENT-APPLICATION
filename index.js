import express from 'express';
import authRouter from './router/auth.js';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './router/user.js';
import investmentOppRouter from './router/investmentOpp.js';

const app = express();
const PORT = process.env.PORT;
app.use(cors());

app.use(express.json());

app.use('/api/auth',authRouter);
app.use('/api/admin',userRouter)
app.use('/api/opportunities',investmentOppRouter)


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