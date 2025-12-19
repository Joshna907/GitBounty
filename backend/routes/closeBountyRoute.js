const express = require("express");
const router = express.Router();
const { closeBounty } = require("../controllers/closeBountyController");

router.patch("/:bountyId", closeBounty);

module.exports = router;
