const express = require("express");
const Bounty = require("../models/CreateBounty"); // Make sure you import your Bounty model
const {
  createBounty,
  getAllBounties,
  getBountyById,
  getBountiesByCreator,
  getBountyWithClaims,
  getSingleClaim,
  claimBounty
} = require("../controllers/CreateBountyController");

const router = express.Router();

// Bounty routes
router.post("/create-bounty", createBounty);
router.get("/all", getAllBounties);
router.get("/get/:id", getBountyById);
router.get("/creator/:wallet", getBountiesByCreator);
router.post("/:bountyId/claim", claimBounty);
router.get("/bounty/:bountyId", getBountyWithClaims);
router.get("/claim/:bountyId/:developer", getSingleClaim);

// Close bounty route
router.put("/:id/close", async (req, res) => {
  try {
    const bounty = await Bounty.findById(req.params.id);
    if (!bounty) return res.status(404).json({ error: "Bounty not found" });

    bounty.status = "CLOSED";
    await bounty.save();

    res.json({ message: "Bounty closed successfully", bounty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
