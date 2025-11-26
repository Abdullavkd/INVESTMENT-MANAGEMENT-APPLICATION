import mongoose from 'mongoose';
import { investmentModel } from '../model/investment.js';


export const addInvestment = async (req, res) => {
    try {
        // take data from req.user
        const user = req.user;
        if(!user) { 
            return res.status(404).json('There is no user on req.user')
        }

        // check role admin
        if(user.role != 'admin') {
            return res.status(404).json("You are not an admin")
        }

        // take data from body
        const {investorId, opportunityId, amount, sharesOrUnits, status} = req.body;

        if(!investorId || !opportunityId || !amount || !sharesOrUnits) {
            return res.status(404).json("InvestorId, Opportunity Id, Amount and SharesOrUnits are Required")
        }

        // save to database
        const newInvestment = new investmentModel({
            investorId,
            opportunityId,
            amount,
            sharesOrUnits,
            status
        });

        await newInvestment.save();

        // send response
        res.status(201).json({
            investorId,
            opportunityId,
            amount,
            sharesOrUnits,
            status
        })
    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something went wrong")
    }
}