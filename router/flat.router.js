const express = require("express");
const {
  registerFlat,
  getFlatByID,
  getAllFlats,
  updateFlat,
  deleteFlat
} = require("../controller/Flat.controller"); // Adjust path if needed

const router = express.Router();

// Register a new flat
router.post("/registerFlat", registerFlat);

// Get a single flat by ID
router.get("/getFlatByID", getFlatByID);

// Get all flats
router.get("/getAllFlats", getAllFlats);

// Update a flat
router.put("/updateFlat", updateFlat);

// Delete a flat
router.delete("/deleteFlat", deleteFlat);

module.exports = router;
