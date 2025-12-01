const express = require("express");
const router = express.Router();

const badges = require("../data/badges");

router.get("/", (req,res) =>{
    res.json(badges);
});

module.exports = router;

