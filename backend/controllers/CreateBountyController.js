const Bounty = require("../models/CreateBounty");

//create new bounty
const createBounty = async(req,res)=>{
    try{
     const {
      bountyId,
      issueUrl,
      rewardAmount,
      rewardType,
      badgeURI,
      creatorAddress
     }= req.body;

     const bounty = await Bounty.create({
      bountyId,
      issueUrl,
      rewardAmount,
      rewardType,
      badgeURI,
      creatorAddress
     });
     res.json({success:true,bounty});

    }catch(err){
        console.error("Error creating bounty:", err);
        res.status(500).json({message:"Server error"});
    }
}


module.exports = {createBounty};