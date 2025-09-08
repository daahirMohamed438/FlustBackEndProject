const express = require("express");

const { joinSomeTables, showAllUsers, getUserById, show, joinBookingDetails } = require('../controller/join');
const router = express.Router();

router.post("/joinSomeTables", joinSomeTables)
router.get("/showAllUsers", showAllUsers)
router.get("/getUserById/:userId", getUserById)
router.post("/show", show)
router.post("/joinBookingDetails", joinBookingDetails)

module.exports = router