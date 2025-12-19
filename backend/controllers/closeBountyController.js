const Bounty = require("../models/CreateBounty");


const closeBounty = async (req, res) => {
  try {
    const { bountyId } = req.params;

    // 1️⃣ Validate bountyId
    if (!bountyId || isNaN(bountyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bountyId"
      });
    }

    // 2️⃣ Find bounty by blockchain ID
    const bounty = await Bounty.findOne({ bountyId: Number(bountyId) });

    if (!bounty) {
      return res.status(404).json({
        success: false,
        message: "Bounty not found in database"
      });
    }

    // 3️⃣ Prevent double close
    if (bounty.status === "CLOSED") {
      return res.status(400).json({
        success: false,
        message: "Bounty already closed"
      });
    }

    // 4️⃣ Update DB state
    bounty.status = "CLOSED";
    bounty.updatedAt = new Date();

    await bounty.save();

    // 5️⃣ Respond success
    return res.status(200).json({
      success: true,
      message: "Bounty closed successfully",
      bountyId: bounty.bountyId
    });

  } catch (error) {
    console.error("❌ Close bounty error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {closeBounty};