const express = require("express");
const { addRating, updateRating, getRatingsByFlat, getRatingSummary } = require("../controller/rating.controller");

const router = express.Router();

router.post("/addRating", addRating);
router.put("/updateRating", updateRating);
router.get("/getRatingsByFlat", getRatingsByFlat);
router.get("/getRatingSummary", getRatingSummary);

module.exports = router;


