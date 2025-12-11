const  express = require("express");
const { getIssueTitle } = require("../controllers/IssueController");

const router = express.Router();

router.post("/fetch-title", getIssueTitle);

module.exports = router;