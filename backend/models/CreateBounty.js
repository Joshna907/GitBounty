const mongoose = require("mongoose");

const bountySchema = new mongoose.Schema({
  bountyId: Number,        // from blockchain
  issueUrl: String,        // Only GitHub URL
  rewardAmount: Number,
  rewardType: String,      // "ETH" or "TOKEN"
  badgeURI: String,
  creatorAddress: String,  // wallet address
  status: { type: String, default: "OPEN" },
  submissions: [
    {
      developerAddress: String,
      submissionLink: String,
      notes: String,
    }
  ],
  winnerAddress: String,
  winnerUsername: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bounty", bountySchema);
