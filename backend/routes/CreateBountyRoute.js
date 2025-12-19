const express = require("express");
const {createBounty,getAllBounties,getBountyById,getBountiesByCreator,getBountyWithClaims,getSingleClaim, getDeveloperDashboard,claimBounty,handleClaim} = require("../controllers/CreateBountyController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/create-bounty", authMiddleware, createBounty);
router.get("/all", getAllBounties);
router.get("/get/:id", getBountyById);
router.get("/creator/:wallet", getBountiesByCreator);
router.post("/:bountyId/claim",authMiddleware, claimBounty);
router.get("/bounty/:bountyId",getBountyWithClaims)
router.get("/claim/:bountyId/:developer", getSingleClaim);
router.patch("/:bountyId/handle-claim", handleClaim);

router.get("/dashboard/:wallet", getDeveloperDashboard);

module.exports = router;

