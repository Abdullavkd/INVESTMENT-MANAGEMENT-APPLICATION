import mongoose from 'mongoose';
import { investmentModel } from '../model/investment.js';
import { userModel } from '../model/user.js';
import { investmentOppModel } from '../model/inverstmentOpp.js';


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

        if(!req.body) {
            return res.status(404).json("There is no data on body")
        }

        // take data from body
        const {investorId, opportunityId, amount, sharesOrUnits, status} = req.body;

        if(!investorId || !opportunityId || !amount || !sharesOrUnits) {
            return res.status(404).json("InvestorId, Opportunity Id, Amount and SharesOrUnits are Required")
        }

        if(!mongoose.Types.ObjectId.isValid(investorId)) {
            return res.status(404).json("Invalid Investor Id")
        }

        if(!mongoose.Types.ObjectId.isValid(opportunityId)) {
            return res.status(404).json("Invalid Opportunity Id")
        }

        // find investor and investment opportunity from database
        const findInvestor = await userModel.findOne({_id:investorId});

        if(!findInvestor) {
            return res.status(404).json("There is no investor with the id")
        }

        const findOpportunity = await investmentOppModel.findOne({_id:opportunityId});

        if(!findOpportunity) {
            return res.status(404).json("There is no Opportunity with the id")
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
        res.status(201).json({message:'Created Successfully',details:{
            investorId,
            opportunityId,
            amount,
            sharesOrUnits,
            status
        }
        })
    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something went wrong")
    }
}