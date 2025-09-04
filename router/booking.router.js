const express = require("express");
const {
  createBooking,
  getBookingById,
  getAllBookings,
  updateBooking,
  deleteBooking,
  cancelBooking,
  bookingStatusByUser,
  historyBookingUser,
 
  // getFavorites
}
 = require("../controller/booking.controller");

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
router.put("/cancelBooking", cancelBooking);
router.post("/bookingStatus", bookingStatusByUser);
router.post("/historyBookingUser", historyBookingUser);
// router.post("/addFaorite", addFaorite);
// router.post("/getFavorites", getFavorites);
//

module.exports = router;
