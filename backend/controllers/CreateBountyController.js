const Bounty = require("../models/CreateBounty");
const {fetchIssueTitle} = require("../utils/fetchIssueTitle");

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
      tags,
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
    const issueTitle = await fetchIssueTitle(githubIssueUrl);

    
    const bounty = await Bounty.create({
      bountyId: bountyId != null ? Number(bountyId) : null,
      githubIssueUrl: githubIssueUrl.trim(),
      rewardAmount: normalizedReward,
      badgeURI: badgeURI || null,
      creatorAddress: creatorAddress.toLowerCase(),

      // ✅ Save Explore page filter data
      projectName: projectName.trim(),
      issueTitle:issueTitle.trim(),
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

// Get all bounties
const getAllBounties = async (req, res) => {
  try {
    const bounties = await Bounty.find().sort({ createdAt: -1 });  
    return res.status(200).json({ success: true, bounties });
  } catch (err) {
    console.error("🔥 Error fetching bounties:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single bounty by DB ID
const getBountyById = async (req, res) => {
  try {
    const { id } = req.params;

    const bounty = await Bounty.findById(id);

    if (!bounty) {
      return res.status(404).json({ success: false, message: "Bounty not found" });
    }

    return res.status(200).json({ success: true, bounty });
  } catch (err) {
    console.error("🔥 Error fetching bounty:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get bounties created by a specific creator
const getBountiesByCreator = async (req, res) => {
  try {
    const { address } = req.params;

    const bounties = await Bounty.find({
      creatorAddress: address.toLowerCase()
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, bounties });
  } catch (err) {
    console.error("🔥 Error fetching creator bounties:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// cliam bounty
const claimBounty = async (req, res) => {
  try {
    const { bountyId } = req.params;
    const { developerAddress, submissionLink, notes } = req.body;

    // Basic validation
    if (!developerAddress || !submissionLink) {
      return res.status(400).json({
        success: false,
        message: "Developer address and submission link are required",
      });
    }

    // Find bounty by blockchain bountyId
    const bounty = await Bounty.findOne({ bountyId: Number(bountyId) });

    if (!bounty) {
      return res.status(404).json({
        success: false,
        message: "Bounty not found",
      });
    }

    // Prevent duplicate claims by same developer
    const alreadySubmitted = bounty.submissions.some(
      (s) => s.developerAddress.toLowerCase() === developerAddress.toLowerCase()
    );

    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,
        message: "You already submitted a solution for this bounty",
      });
    }

    // Push new submission
    bounty.submissions.push({
      developerAddress: developerAddress.toLowerCase(),
      submissionLink,
      notes: notes || "",
    });

    // Update status → IN_REVIEW
    bounty.status = "IN_REVIEW";

    await bounty.save();

    return res.status(200).json({
      success: true,
      message: "Bounty claimed successfully",
      bounty,
    });

  } catch (err) {
    console.error("🔥 Error claiming bounty:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};




module.exports = { createBounty,getAllBounties, getBountyById,getBountiesByCreator, claimBounty};
