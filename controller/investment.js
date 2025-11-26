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










/**
 * Function to list investment items
 * @param {*} req
 * @param {*} res
 */
export const listInvetsments = async (req, res) => {
    try {
        // check user role
        const user = req.user;
        if(!user) {
            return res.status(404).json("There is no user provided")
        }
        if(user.role != 'amdin' && user.role != 'superAdmin') {
            return res.status(404).json("You Are not an admin or superAdmin")
        }

        // take data from query
        const investorId = req.query.investorId;
        const opportunityId = req.query.opportunityId;

        let investments;
        if(investorId && opportunityId) {
            // check id on mongoose
        if(!mongoose.Types.ObjectId.isValid(investorId)) {
            return res.status(404).json("Invalid InvestorId")
        }
        if(!mongoose.Types.ObjectId.isValid(opportunityId)) {
            return res.status(404).json("Invalid OpportunityId")
        }

        // find investments from database
        investments = await investmentModel.find({investorId:investorId, opportunityId:opportunityId});

        }else if(investorId) {
            if(!mongoose.Types.ObjectId.isValid(investorId)) {
                return res.status(404).json("Invalid InvestorId")
            }
            // find investments from database
            investments = await investmentModel.find({investorId:investorId});

        }else if(opportunityId) {
            if(!mongoose.Types.ObjectId.isValid(opportunityId)) {
                return res.status(404).json("Invalid opportunityId")
            }
            // find investments from database
            investments = await investmentModel.find({opportunityId:opportunityId});
        }else{
          // find investments from database
            investments = await investmentModel.find();  
        }
console.log(investments)
        if(!investments) {
            return res.status(404).json("There is no credencials")
        }

        res.status(200).json(investments)

    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something Went Wrong Getting List")
    }
}









/**
 * Function to get investment list of logged in investor
 * @param {*} req
 * @param {*} res
 */
export const investListMy = async (req, res) => {
    try {
        // check investor
        const user = req.user;
        if(!user) {
            return res.status(404).json("There is no user")
        }

        // check role
        if(user.role != 'investor') {
            return res.status(404).json("You are not an investor")
        }

        // take user id
        const id = user._id;

        // find investment from database using user id
        const investments = await investmentModel.find({investorId:id});

        if(investments.length == 0) {
            return res.status(404).json("You have no investments")
        }

        // send response
        res.status(200).json(investments);
    } catch (error) {
        res.status(error.status || 500).json(error.message || "Somthing Went Wrong");
    }
};