import { investmentOppModel } from "../model/inverstmentOpp.js";


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
        let {companyName, equityDetails, targetPrice, returnPercentage, minInvestment} = req.body;

        if(!companyName || !equityDetails || !targetPrice || !returnPercentage) {
            return res.status(404).json("Company Name, Equity Details, Target Price and Return Percentage fields are Required.")
        }

        if(!minInvestment) {
            minInvestment = 0;
        }

        // save to database
        const newInvestOpp = new investmentOppModel({
            companyName,
            equityDetails,
            targetPrice,
            returnPercentage,
            minInvestment,
            postedBy:userId
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

