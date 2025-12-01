const TokenRequest = require("../models/TokenRequest");

// CREATE request
const createRequest = async (req, res) => {
  try {
    const { walletAddress, amount, reason } = req.body;

    const newReq = await TokenRequest.create({
      walletAddress,
      amount,
      reason
    });

    res.status(201).json({
      success: true,
      message: "Request submitted",
      data: newReq
    });
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET all (admin)
const getAllRequests = async (req, res) => {
  try {
    const requests = await TokenRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// UPDATE status (admin)
 const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await TokenRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports={
    createRequest,
    getAllRequests,
    updateStatus
}