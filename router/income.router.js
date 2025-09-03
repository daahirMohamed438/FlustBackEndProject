const express = require("express");
const {getDailyIncomeOwner} = require("../controller/dailyIncomeOwner.controller")


const router = express.Router();
router.post("/getDailyIncome", getDailyIncomeOwner);


module.exports = router;