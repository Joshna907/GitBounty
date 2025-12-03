const Bounty = require("../models/CreateBounty");

// Create new bounty
const createBounty = async (req, res) => {
  try {
    const {
      bountyId,
      githubIssueUrl,
      rewardAmount,
      badgeURI,
      creatorAddress,
      txHash,
      timestamp,

      // ✅ new fields
      projectName,
      language,
      difficultyLevel,
      deadline,
      rewardRange,
      tags
    } = req.body;

    // Validations
    if (!githubIssueUrl?.trim()) {
      return res.status(400).json({ success: false, message: "GitHub Issue URL required" });
    }
    if (!creatorAddress?.trim()) {
      return res.status(400).json({ success: false, message: "Creator wallet address required" });
    }

    if (!projectName?.trim()) {
      return res.status(400).json({ success: false, message: "Project name is required" });
    }
    if (!language?.trim()) {
      return res.status(400).json({ success: false, message: "Language is required for filtering" });
    }
    if (!difficultyLevel?.trim()) {
      return res.status(400).json({ success: false, message: "Difficulty level required" });
    }
    if (!deadline?.trim()) {
      return res.status(400).json({ success: false, message: "Deadline is required" });
    }

    // Normalize reward safely
    const normalizedReward = rewardAmount != null ? String(rewardAmount) : "0";

    const bounty = await Bounty.create({
      bountyId: bountyId != null ? Number(bountyId) : null,
      githubIssueUrl: githubIssueUrl.trim(),
      rewardAmount: normalizedReward,
      badgeURI: badgeURI || null,
      creatorAddress: creatorAddress.toLowerCase(),

      // ✅ Save Explore page filter data
      projectName: projectName.trim(),
      language: language || "Solidity",
      difficultyLevel: difficultyLevel || "Beginner",
      deadline: deadline.trim(),
      rewardRange: rewardRange || "0 - 0.01 ETH",
      tags: Array.isArray(tags) ? tags : [],

      submissions: Array.isArray(req.body.submissions) ? req.body.submissions : [],
      winnerAddress: null,
      winnerUsername: null,
      txHash: txHash || null,
      timestamp: timestamp || Math.floor(Date.now() / 1000)
    });

    return res.status(201).json({ success: true, bounty });

  } catch (err) {
    console.error("🔥 Error saving bounty:", err);
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

module.exports = { createBounty };
