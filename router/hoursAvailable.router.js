const express = require("express");
const {createAvailableHours,updateAvailableHours,getAllHoursAvailable,getHoursByFlatId} = require('../controller/hoursAvailableController')
const router = express.Router();
const {authMiddlewareBodyByOwner} = require("../middleware/authMiddleware")

router.post("/createAvailableHours",// requireUserId, 
     authMiddlewareBodyByOwner,createAvailableHours)
router.get("/getAllhourAvailable", //requireUserId,
     getAllHoursAvailable)
router.post("/getHoursByFlatId", //requireUserId,
     getHoursByFlatId)
router.post("/updateAvailableHours", //requireUserId,
     updateAvailableHours)
//
module.exports = router    