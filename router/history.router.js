const express = require("express");
// const { getHistoryUser } = require("../controller/history.controller");
const {getHistoryUser}  = require("../controller/history.controller");

 


const router = express.Router();
console.log(getHistoryUser); // should print [Function: getHistoryUser]

router.post("/getHistoryUser", getHistoryUser);
module.exports = router; 