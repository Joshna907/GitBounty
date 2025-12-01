const express = require("express");
const {createBounty} = require("../controllers/CreateBountyController");


const router = express.Router();


router.post("/create-bounty", createBounty);

module.exports = router;

