const express = require("express");
const {createBounty,getAllBounties,getBountyById,getBountiesByCreator,claimBounty} = require("../controllers/CreateBountyController");


const router = express.Router();


router.post("/create-bounty", createBounty);
router.get("/all", getAllBounties);
router.get("/get/:id", getBountyById);
router.get("/creator/:address", getBountiesByCreator);
router.post("/:bountyId/claim", claimBounty);


module.exports = router;

