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
  confirmBooking,
  allJoinTables
 
  // getFavorites
}

 = require("../controller/booking.controller");

const router = express.Router();
const requireUserId = require("../middleware/requireUserId");

// Create a new booking
router.post("/createBooking",
  //  requireUserId, 
  createBooking);

// Get a single booking by ID
router.get("/getBookingById",
  //  requireUserId, 
  getBookingById);

// Get all bookings
router.get("/getAllBookings",
  //  requireUserId,
   getAllBookings);

// Update a booking (e.g., status)
router.put("/updateBooking",updateBooking);
router.post("/allJoinTables",allJoinTables);

   //allJoinTables

// Delete a booking
router.delete("/deleteBooking",
  //  requireUserId, 
   
   deleteBooking
  );
router.put("/cancelBooking",
  //  requireUserId, 
   cancelBooking);
router.post("/bookingStatus",
  //  requireUserId, 
   bookingStatusByUser);
router.post("/historyBookingUser",
  //  requireUserId, 
   historyBookingUser);
router.post("/confirmBooking",
  //  requireUserId, 
   confirmBooking);
//
// router.post("/addFaorite", addFaorite);
// router.post("/getFavorites", getFavorites);
//

module.exports = router;
