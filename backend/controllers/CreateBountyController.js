const Bounty = require("../models/CreateBounty");
const {fetchIssueTitle} = require("../utils/fetchIssueTitle");
const User = require("../models/User");
const jwt = require("jsonwebtoken"); // top of file (only once)

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
    // ================= AUTO-ASSIGN CREATOR ROLE =================
    // ================= AUTO-ASSIGN CREATOR ROLE =================
// 🔥 Get user from GitHub login (JWT)
const userId = req.user?.id;   // comes from auth middleware
if (!userId) {
  return res.status(401).json({ success: false, message: "Unauthorized" });
}

const user = await User.findById(userId);
if (!user) {
  return res.status(404).json({ success: false, message: "User not found" });
}

// 🔥 Save wallet if not already saved
if (!user.walletAddress) {
  user.walletAddress = creatorAddress.toLowerCase();
}

// 🔥 Assign creator role
user.roles.creator = true;
await user.save();


// 🔥 GENERATE JWT ONLY IF USER EXISTS
token = jwt.sign(
  {
    id: user._id,
    avatar: user.avatar,
    roles: user.roles   // ✅ ADD THIS
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


return res.status(201).json({
  success: true,
  bounty,
  token
});

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
    const { wallet } = req.params;

    if (!wallet) {
      return res.status(400).json({ success: false, message: "Wallet missing" });
    }

    // Get creator bounties
    const bounties = await Bounty.find({
      creatorAddress: wallet.toLowerCase()
    }).sort({ createdAt: -1 });

    // Collect all submissions from every bounty
    let submissions = [];
    bounties.forEach(b => {
      if (b.submissions && b.submissions.length > 0) {
        b.submissions.forEach(s => {
          submissions.push({
             bountyId: s.bountyId, 
            projectName: b.projectName,
            developerAddress: s.developerAddress,
            submissionLink: s.submissionLink,
            notes: s.notes,
            
          });
        });
      }
    });
    

    return res.status(200).json({
      success: true,
      bounties,
      recentSubmissions: submissions,
      
    });

  } catch (err) {
    console.error("🔥 Error fetching creator bounties:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



//get bounty with claim
const getBountyWithClaims = async (req, res) => {
  try {
    const { bountyId } = req.params;   

    const bounty = await Bounty.findOne({ bountyId: bountyId });

    if (!bounty) {
      return res.status(404).json({
        success: false,
        message: "Bounty not found",
      });
    }

    return res.status(200).json({
      success: true,
      bounty: {
        bountyId: bounty.bountyId,
        projectName: bounty.projectName,
        issueTitle: bounty.issueTitle,
        githubIssueUrl: bounty.githubIssueUrl,
        rewardAmount: bounty.rewardAmount,
        badgeURI: bounty.badgeURI,
        creatorAddress: bounty.creatorAddress,
        language: bounty.language,
        difficultyLevel: bounty.difficultyLevel,
        deadline: bounty.deadline,
        rewardRange: bounty.rewardRange,
        tags: bounty.tags,
        description: bounty.description,
        status: bounty.status,
        createdAt: bounty.createdAt,

        // ⭐ ALL SUBMISSIONS (CLAIMS)
        submissions: bounty.submissions?.map((s) => ({
           bountyId: s.bountyId, 
          developerAddress: s.developerAddress,
          submissionLink: s.submissionLink,
          notes: s.notes,
          createdAt: s.createdAt,   // 🔥 FIXED FIELD
        })) || []
      }
    });

  } catch (err) {
    console.error("🔥 Error fetching bounty with claims:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// get single claim
const getSingleClaim = async (req, res) => {
  try {
    const { bountyId, developer } = req.params;

    const bounty = await Bounty.findOne({ bountyId: Number(bountyId) });

    if (!bounty) {
      return res.status(404).json({
        success: false,
        message: "Bounty not found",
      });
    }

    const claim = bounty.submissions.find(
      (s) => s.developerAddress.toLowerCase() === developer.toLowerCase()
    );

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found for this developer",
      });
    }

    return res.status(200).json({
      success: true,
      bounty: {
        bountyId: bounty.bountyId,
        projectName: bounty.projectName,
        issueTitle: bounty.issueTitle,
        rewardAmount: bounty.rewardAmount,
        rewardRange: bounty.rewardRange,
        language: bounty.language,
        difficultyLevel: bounty.difficultyLevel,
        deadline: bounty.deadline,
        status: bounty.status,
      },
      claim: {
        bountyId: claim.bountyId,
        developerAddress: claim.developerAddress,
        submissionLink: claim.submissionLink,
        notes: claim.notes,
        createdAt: claim.createdAt
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};



// POST /api/bounties/:bountyId/claim
const claimBounty = async (req, res) => {
  try {
    const { bountyId } = req.params;
    const { developerAddress, submissionLink, notes } = req.body;

    const bounty = await Bounty.findOne({ bountyId: Number(bountyId) });

    if (!bounty) {
      return res.status(404).json({
        success: false,
        message: "Bounty not found",
      });
    }

    // Push submission
    bounty.submissions.push({
      bountyId: Number(bountyId),
      developerAddress: developerAddress.toLowerCase(),
      submissionLink,
      notes,
      createdAt: new Date(),
    });

    await bounty.save();
   // ================= AUTO-ASSIGN DEVELOPER ROLE =================
   let user = null;
const userId = req.user?.id;
if (userId) {
   user= await User.findById(userId);
  if (user) {
    if (!user.walletAddress) {
      user.walletAddress = developerAddress.toLowerCase();
    }
    user.roles.developer = true;
    await user.save();
  }
}

token = jwt.sign(
  {
    id: user._id,
    avatar: user.avatar,
    roles: user.roles   
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);


return res.json({
  success: true,
  bounty,
  token
});


  } catch (err) {
    console.error("🔥 Error submitting claim:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// handle claim
const handleClaim = async (req, res) => {
  try {
    const { bountyId } = req.params;
    const {
      developerAddress,
      approve,                // true = approve, false = reject
      messageFromCreator,
      winnerUsername,
      txHash,
      timestamp
    } = req.body;

    const bounty = await Bounty.findOne({ bountyId: Number(bountyId) });
    if (!bounty) {
      return res.status(404).json({ success: false, message: "Bounty not found" });
    }

    const devLower = developerAddress.toLowerCase();

    const submission = bounty.submissions.find(
      s => s.developerAddress.toLowerCase() === devLower
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    submission.messageFromCreator = messageFromCreator || null;
    submission.updatedAt = new Date();

    // ================= APPROVE =================
    if (approve === true) {
      submission.isApproved = true;

      bounty.status = "APPROVED";
      bounty.winnerAddress = devLower;
      bounty.winnerUsername = winnerUsername || null;
      bounty.txHash = txHash || bounty.txHash;
      bounty.timestamp = timestamp || Math.floor(Date.now() / 1000);
    }

    // ================= REJECT =================
    if (approve === false) {
      submission.isApproved = false;

      bounty.status = "REJECT"; // ✅ USE ENUM
      bounty.winnerAddress = null;
      bounty.winnerUsername = null;
      bounty.txHash = null;
      bounty.timestamp = null;
    }

    await bounty.save();

    res.json({
      success: true,
      message: approve ? "Claim approved" : "Claim rejected",
      bountyStatus: bounty.status,
      updatedSubmission: submission
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


//get data for devloper dashboard 

const getDeveloperDashboard = async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();

    const bounties = await Bounty.find({
      "submissions.developerAddress": wallet
    });

    let totalSubmissions = 0;
    let approved = 0;
    let rejected = 0;
    let pending = 0;
    let ethEarned = 0;

    let skillsSet = new Set();
    let activity = [];

    bounties.forEach(bounty => {
      bounty.submissions.forEach(sub => {
        if (sub.developerAddress.toLowerCase() === wallet) {

          totalSubmissions++;
          skillsSet.add(bounty.language);

          if (sub.isApproved) {
            approved++;
            ethEarned += parseFloat(bounty.rewardAmount || 0);
          } else if (bounty.status === "REJECT") {
            rejected++;
          } else {
            pending++;
          }

          activity.push({
            text: bounty.projectName || bounty.issueTitle,
            status: sub.isApproved
              ? "approved"
              : bounty.status === "REJECT"
              ? "rejected"
              : "pending",
            date: sub.createdAt
          });
        }
      });
    });

    activity.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Available bounties preview
    const availableBounties = await Bounty.find({ status: "OPEN" })
      .limit(3)
      .select("projectName rewardAmount language deadline");

    res.json({
      stats: {
        totalSubmissions,
        approved,
        rejected,
        pending,
        ethEarned: ethEarned.toFixed(3),
        bountiesWon: approved,
        badges: approved
      },
      skills: [...skillsSet],
      activity: activity.slice(0, 5),
      availableBounties
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Developer dashboard error" });
  }
};

module.exports = { createBounty,getAllBounties, getBountyById,getBountiesByCreator, getBountyWithClaims,getSingleClaim,getDeveloperDashboard,claimBounty,handleClaim};
