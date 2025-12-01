const express = require("express");
const {createRequest,getAllRequests,updateStatus} = require("../controllers/TokenRequestController");


const router = express.Router();

router.post("/create" , createRequest);
router.get("/all", getAllRequests);
router.put("/status/:id", updateStatus);


module.exports= router;