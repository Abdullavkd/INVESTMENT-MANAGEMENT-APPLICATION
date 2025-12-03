import mongoose, { Schema } from "mongoose";
import { investmentOppModel } from "../model/inverstmentOpp.js";
import { investmentModel } from "../model/investment.js";
import { userModel } from "../model/user.js";


export const getDashboardSummary = async (req, res) => {
    try {
        // check user
        if(!req.user) {
            return res.status(404).json("There is no user Provided on req.user")
        }
        const user = req.user;
        if(user.role != 'admin' && user.role != 'superAdmin') {
            return res.status(404).json("You are not an Admin or Super Admin")
        }

        const [
            totalInvestors,
            totalOpportunities,
            aumResult
        ] = await Promise.all([
            userModel.countDocuments({role:'investor'}),
            investmentOppModel.countDocuments(),
            investmentModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAUM: {$sum: "$amount"}
                    }
                }
            ])
        ]);

        // AUM Result is an Array: [{_id: null, totalAUM: 945804.902}]
        let totalAUM
        if(aumResult.length > 0) {
            totalAUM = aumResult[0]
        }else{
            totalAUM = 0
        }
console.log(aumResult)
        const summaryData = {
            totalInvestors:totalInvestors,
            totalOpportunities:totalOpportunities,
            totalAUM:totalAUM.totalAUM
        }

        res.status(200).json(summaryData);
    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something Went Wrong");
    }
}










/**
 * Function to get All Investors' stats
 * @param {*} req 
 * @param {*} res 
 */
export const investorsStats = async (req, res) => {
    try {
        // check user
        if(!req.user) {
            return res.status(401).json('There is no user')
        }
        const user = req.user;
        if(user.role != 'admin' && user.role != 'superAdmin') {
            return res.status(403).json("You are an Investor")
        }

        // take data from query
        const limit = Number(req.query.limit) || 1;
        const page = Number(req.query.page) || 1;

        const skip = (page-1) * limit;

        // take data from mongodb
        const investor = await userModel.aggregate([
                {
                    $match:{role:'investor'}
                },
                {
                    $lookup:{
                        from:"investments",
                        localField:"_id",
                        foreignField:"investorId",
                        as:"investment"
                    }
                },
                {
                    $unwind:{path:"$investment"}
                },
                {
                    $group:{
                        _id:"$_id",
                        name:{$first:"$name"},
                        email:{$first:"$email"},
                        totalInvested:{$sum:{$ifNull:["$investment.amount",0]}},
                        countInvestment:{$sum:{$cond:[{$ne:["$investment.amount",null]},1,0]}}
                    }
                },
                {
                    $project:{
                        _id:1,
                        name:1,
                        email:1,
                        totalInvested:1,
                        countInvestment:1
                    }
                }
            ])// set limit and page
            .skip(skip).limit(limit)
            
            if(!investor) {
                return res.status(404).json("There in no data")
            }
            res.status(200).json(investor)
    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something Went Wrong")
    }
}










/**
 * Fucntion to get all investments of an investor
 * @param {*} req 
 * @param {*} res  
 */
export const investorProfile = async (req, res) => {
    try {
        // check admin
        if(!req.user) {
            return res.status(401).json("There is no user in req.user")
        }
        const user = req.user;
        if(user.role != 'admin' && user.role != "superAdmin") {
            return res.status(403).json("You are not an admin or super Admin")
        }

        // check availability
        const investorId = req.params.investorId;
        if(!investorId) {
            return res.status(400).json("There is no data provided in params")
        }
        if(!mongoose.Types.ObjectId.isValid(investorId)) {
            return res.status(404).json("Invalid InvestorId")
        }

        // convert objectId from string to type ObjectId
        const investorIdObj = new mongoose.Types.ObjectId(investorId)

        // takes data from database and check
        const investor = await userModel.findOne({_id:investorIdObj});
        if(!investor) {
            return res.status(404).json("There is no investor with provided id")
        }
        
        // take investment details by the user
        const investments = await userModel.aggregate([
            {
                $match:{_id:investorIdObj}
            },
            {
                $lookup:{
                    from:"investments",
                    localField:"_id",
                    foreignField:"investorId",
                    as:"investments"
                }
            }
        ])

        if(investments[0].investments.length == 0) {
            return res.status(200).json({Investor:investor,Investments: "There is no investments for the investor"})
        }

        res.status(200).json(investments)
    
    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something Went Wrong")
    }
}










export const getOpportunity = async (req, res) => {
    try {
        // take data from req.user
        if(!req.user) {
            return res.status(404).json("There is no user on req.user")
        }
        const user = req.user;
        if(user.role != "admin" && user.role != "superAdmin") {
            return res.status(404).json("You are not an Admin or SuperAdmin")
        }

        // take data from database
        const opportunities = await investmentOppModel.find();
        if(!opportunities) {
            return res.status(404).json("There is no Opportunities")
        }

        const allOppDetails = await investmentOppModel.aggregate([
            {
                $lookup:{
                    from:"investments",
                    localField:"_id",
                    foreignField:"opportunityId",
                    as:"invests"
                },
            },
            {
                $unwind:{
                    path:"$invests",
                    preserveNullAndEmptyArrays:true
                },
            },
            {
                $group:{
                    _id:"$_id",
                    companyName:{$first:"$companyName"},
                    equityDetails:{$first:"$equityDetails"},
                    totalSum:{$sum:"$invests.amount"},
                    totalInvestors:{$sum:{$cond:[{$ne:["$invests.amount",null]},1,0]}}
                },
            },
            {
                $project:{
                    _id:1,
                    companyName:1,
                    equityDetails:1,
                    totalSum:1,
                    totalInvestors:1
                }
            }
        ]);

        res.status(200).json(allOppDetails)
    } catch (error) {
        res.status(error.status || 500).json(error.message || "Something Went Wrong")
    }
}