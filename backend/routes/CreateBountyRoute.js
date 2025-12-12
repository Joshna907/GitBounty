const express = require("express");
const {createBounty,getAllBounties,getBountyById,getBountiesByCreator,getBountyWithClaims,getSingleClaim, claimBounty} = require("../controllers/CreateBountyController");


const router = express.Router();


router.post("/create-bounty", createBounty);
router.get("/all", getAllBounties);
router.get("/get/:id", getBountyById);
router.get("/creator/:wallet", getBountiesByCreator);
router.post("/:bountyId/claim", claimBounty);
router.get("/bounty/:bountyId",getBountyWithClaims)
router.get("/claim/:bountyId/:developer", getSingleClaim);

module.exports = router;

