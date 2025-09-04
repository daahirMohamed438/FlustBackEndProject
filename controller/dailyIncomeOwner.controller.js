const Booking = require("../model/booking.model");
const errorHandle = require("../utils/errorHandler");
const sendMonthlyDiscountNotification = require("../utils/sendnotification"); // import function


exports.getDailyIncomeOwner = errorHandle(async (req, res) => {
    let { startDate, endDate } = req.body;

    const now = new Date();
    if (!startDate) {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else {
      startDate = new Date(startDate);
      startDate.setHours(0, 0, 0, 0);
    }
  
    if (!endDate) {
      endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
    } else {
      endDate = new Date(endDate);
      endDate.setHours(23, 59, 59, 999);
    }
  
    const bookingsInRange = await Booking.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });
  
    if (!bookingsInRange || bookingsInRange.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found in this date range",
      });
    }
  
    const totalIncome = bookingsInRange.reduce(
      (sum, booking) => sum + Number(booking.price),
      0
    );
  const totalIncomeWithCurrency = "$" + totalIncome; // Using $ as example
// Call notification function here
 
  await sendMonthlyDiscountNotification();
    res.status(200).json({
      success: true,
      count: bookingsInRange.length,
      totalIncome,
      currency: "$", 
    //   bookings: bookingsInRange, 
    //   startDate,
    //   endDate,
    });
  });
  
  

// module.exports =  getDailyIncomeOwner ;
// dailyIncomeOwner.controller.js
// module.exports = { getDailyIncomeOwner };
