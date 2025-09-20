const express = require("express");
const {
  registerFlat,
  getFlatByID,
  getAllFlats,
  updateFlat,
  deleteFlat
} = require("../controller/flat.controller");
const { authMiddlewareBody } = require("../middleware/authMiddleware");
const router = express.Router();

// Register a new flat
router.post("/registerFlat", authMiddlewareBody, registerFlat);

// Get a single flat by ID
router.get("/getFlatByID",authMiddlewareBody,getFlatByID);

// Get all flats
router.get("/getAllFlats",authMiddlewareBody, getAllFlats);

// Update a flat
router.put("/updateFlat",authMiddlewareBody, updateFlat);

// Delete a flat
router.delete("/deleteFlat",authMiddlewareBody, deleteFlat);

module.exports = router;
