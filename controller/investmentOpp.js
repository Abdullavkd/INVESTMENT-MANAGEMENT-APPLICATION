import { investmentOppModel } from "../model/inverstmentOpp.js";
import mongoose from "mongoose";


/**
 * Function to create new investment opportunities
 * @param {Object} req 
 * @param {Object} res 
 */
export const investOpp = async(req, res) => {
    try {
        // take data from req.user
        if(!req.user) {
            return res.status(404).json("There is no data on req.user")
        }
        const user = req.user;
    
        if(user.role != "admin") {
            return res.status(404).json('You are not an admin, so you can not create an investment opportunity')
        }

        // take user id to save as postedBy
        const userId = user._id;

        // take data from body
        if(!req.body) {
            return res.status(404).json("There is no data on req.body")
        }
        let {companyName, equityDetails, targetPrice, returnPercentage, minInvestment, status} = req.body;

        if(!companyName || !equityDetails || !targetPrice || !returnPercentage) {
            return res.status(404).json("Company Name, Equity Details, Target Price and Return Percentage fields are Required.")
        }

        // if(!minInvestment) {
        //     minInvestment = 0;
        // }

        // save to database
        const newInvestOpp = new investmentOppModel({
            companyName,
            equityDetails,
            targetPrice,
            returnPercentage,
            minInvestment,
            postedBy:userId,
            status
        });
        await newInvestOpp.save()

        // send response
        res.status(201).json({message:'Opportunity Added Successfully',
            Details:{
                companyName,
                equityDetails,
                targetPrice,
                returnPercentage,
                minInvestment,
                postedBy: {name:user.name, email:user.email}
            }
        })
    } catch (error) {
        res.status(error.status || 500).json(error.message ||"Something Went Wrong Creating Investment Opportunities")
    }
}



 /**
  * function to update investment opportunities
  * @param {*} req 
  * @param {*} res 
  */
 export const updateInvestmentOpp = async (req,res) => {
    try {
        // check role admin
        if(!req.user) {
            return res.status(404).json("There is no user in req.user")
        }
        const user = req.user;
        if(user.role != 'admin') {
            return res.status(404).json("You can't Update it, Because You are not an admin")
        }

        // take id from url
        const id = req.params.id;
        if(!id) {
            return res.status(404).json("There is no id provided")
        }
        if(!mongoose.Types.ObjectId){
            return res.status(404).json("Invalid Id")
        }

        // take data from req.body
        if(!req.body) {
            return res.status(404).json("There is no data on req.body")
        }
        const body= req.body;

        // only want to be taken
        let keep = ['companyName', 'equityDetails', 'targetPrice', 'returnPercentage', 'minInvestment','status'];

        // delete other keys from body
        for(let key in body) {
            if(!keep.includes(key)){
                delete body[key]
            }
            // find and check status
            if(key == 'status'){
                if(body[key] != 'Open' && body[key] != 'Fully-Funded' && body[key] != 'Closed') {
                    return res.status(404).json("Invalid Status")
                }
            }
        }

        // update on database
        const updated = await investmentOppModel.findByIdAndUpdate(id,{$set:body},{new:true});

        // send response
        res.status(201).json({message:"Updated Successfully",updated:updated})

    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something Went Wrong Updating Investment Opportunity")
    }
 }


