const express = require("express");
const {
  createBooking,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
} = require("../controller/booking.controller");

const router = express.Router();

// Create a new booking
router.post("/createBooking", createBooking);

// Get a single booking by ID
router.get("/getBookingById", getBookingById);

// Get all bookings
router.get("/getAllBookings", getAllBookings);

// Update a booking (e.g., status)
router.put("/updateBooking", updateBooking);

// Delete a booking
router.delete("/deleteBooking", deleteBooking);

module.exports = router;
