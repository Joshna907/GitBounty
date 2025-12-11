const mongoose = require("mongoose");

const bountySchema = new mongoose.Schema({
  bountyId: Number,        // from blockchain
  githubIssueUrl: String, 
  issueTitle:String,
  rewardAmount: { type: String }, // store ETH as string to avoid precision loss
  badgeURI: String,
  creatorAddress: String,  // wallet address
  status: { 
    type: String,
    enum: ["OPEN","IN_REVIEW", "APPROVED", "CLOSED"],
    default: "OPEN"
  },


  //new added 
  projectName: { type: String, default: null },
  language: { 
    type: String,
    enum: ["Solidity", "JavaScript", "Rust", "Python" ,"Php" ,"Java","C++" , "TypeScript", "Go" ,"C#" ,"Ruby", "Swift"],
    default: "Solidity"
  },
  difficultyLevel: { 
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },
  deadline: { type: String, default: null },

  rewardRange: { type: String, default: "0 - 0.01 ETH" }, // filter bucket

  tags: [{ type: String }], // Optional for filtering labels

  submissions: [
    {
      developerAddress: String,
      submissionLink: String,
      notes: String,
    }
  ],
  winnerAddress: { type: String, default: null }, // set null until approved
  winnerUsername: { type: String, default: null },
  txHash: { type: String, default: null },          // optional but useful
  timestamp: { type: Number, default: null },       // optional UNIX time
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bounty", bountySchema);
