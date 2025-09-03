const errorHandle = require("../utils/errorHandler");
const Booking = require("../model/booking.model");
 
//  exports.getHistoryUser  = errorHandle(async (req, res) => {
//   const { userId } = req.body;

//   if (!userId) {
//     const error = new Error("userId is required");
//     error.statusCode = 400;
//     throw error;
//   }

//   // find bookings by user and populate flat details
//   const history = await Booking.find({ userId })
//     .populate("flatId", "flatName region district village startHour endHour price status") // only select needed fields
//     .populate("ownerId", "name email") // optional: owner info
//     .sort({ createdAt: -1 }); // latest first

//   if (!history || history.length === 0) {
//     const error = new Error("No bookings found for this user");
//     error.statusCode = 404;
//     throw error;
//   }

//   res.status(200).json({
//     success: true,
//     count: history.length,
//     history,
//   });
// });

const getHistoryUser = errorHandle(async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      const error = new Error("userId is required");
      error.statusCode = 400;
      throw error;
    }
  
    const history = await Booking.find({ userId })
      .populate("flatId", "flatName region district village startHour endHour price status")
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });
  
    if (!history || history.length === 0) {
      const error = new Error("No bookings found for this user");
      error.statusCode = 404;
      throw error;
    }
  
    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  });
  
  //  Export as object so destructuring import works in router
  module.exports = { getHistoryUser };