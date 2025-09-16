const express = require("express");
const {
  registerFlat,
  getFlatByID,
  getAllFlats,
  updateFlat,
  deleteFlat
} = require("../controller/flat.controller");
const authMiddlewareBody = require("../middleware/authMiddleware");
const router = express.Router();

// Register a new flat
router.post("/registerFlat", authMiddlewareBody, registerFlat);

// Get a single flat by ID
router.get("/getFlatByID", getFlatByID);

// Get all flats
router.get("/getAllFlats", getAllFlats);

// Update a flat
router.put("/updateFlat", updateFlat);

// Delete a flat
router.delete("/deleteFlat", deleteFlat);

module.exports = router;
