const Booking = require("../model/booking.model");
const errorHandle = require("../utils/errorHandler");
const Flat = require("../model/flat.modet");
const admin = require("../utils/firebase");

  
// User cancels a booking
exports.cancelBooking = errorHandle(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    const error = new Error("Booking ID is required");
    error.statusCode = 400;
    throw error;
  }

  // 1️⃣ Find the booking
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  //   Update booking status to canceled
  booking.status = "canceled";
  await booking.save();

  // Update related flat status to available
  const flat = await Flat.findById(booking.flatId);  
  if (flat) {
    flat.status = "not available";
    await flat.save();
  }

  //   Respond
  res.status(200).json({
    success: true,
    message: "Booking canceled successfully, flat is now available",
    data: booking,
  });
});

// // Create a new booking
// exports.createBooking = errorHandle(async (req, res) => 
//   {
//   const { flatId, userId, ownerId, startDate, endDate, price } = req.body;

//   if (!flatId || !userId || !ownerId || !startDate || !endDate || !price) {
//     const error = new Error("All fields are required");
//     error.statusCode = 400;
//     throw error;
//   }

//   //  Check if flat exists
//   const flat = await Flat.findById(flatId);
//   if (!flat) {
//     const error = new Error("Flat not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   // 2️⃣ Check if flat is available
//   if (flat.status === "not available") {
//     const error = new Error("This flat is not available for booking");
//     error.statusCode = 400;
//     throw error;
//   }

//   // 3️⃣ Create booking
//   const booking = await Booking.create({
//     flatId,
//     userId,
//     ownerId,
//     startDate,
//     endDate,
//     price,
//     status: "pending",
//   });

//   // 4️⃣ Mark flat as not available
//   flat.status = "not available";
//   await flat.save();

//   res.status(201).json({
//     success: true,
//     message: "Booking created successfully",
//     data: booking,
//   });
// });



// Create a new booking
// exports.createBooking = errorHandle(async (req, res) => {
//   const { flatId, userId, ownerId, startDate, endDate, price, fcmToken } = req.body;

//   if (!flatId || !userId || !ownerId || !startDate || !endDate || !price) {
//     const error = new Error("All fields are required");
//     error.statusCode = 400;
//     throw error;
//   }

//   //  Check if flat exists
//   const flat = await Flat.findById(flatId);
//   // if (!flat) {
//   //   const error = new Error("Flat not found");
//   //   error.statusCode = 404;
//     // throw error;
//   // }

//   // 2️⃣ Check if flat is available
//   // if (flat.status === "not available") {
//   //   const error = new Error("This flat is not available for booking");
//   //   error.statusCode = 400;
//   //   throw error;
//   // }

//   // 3️⃣ Create booking
//   const booking = await Booking.create({
//     flatId,
//     userId,
//     ownerId,
//     startDate,
//     endDate,
//     price,
//     status: "pending",
//   });

//   // 4️⃣ Mark flat as not available
//   flat.status = "not available";
//   await flat.save();

//   // 5️⃣ Send FCM Notification
//   // if (fcmToken) {
//   //   const message = {
//   //     token: fcmToken, // the device token (send from Android app)
//   //     notification: {
//   //       title: "New Booking Created 🎉",
//   //       body: `Your booking for ${flat.name} is pending approval.`,
//   //     },
//   //     data: {
//   //       bookingId: booking._id.toString(),
//   //       flatId: flat._id.toString(),
//   //     },
//   //   };

//   //   try {
//   //     await admin.messaging().send(message);
//   //     console.log(" Notification sent successfully");
//   //   } catch (err) {
//   //     console.error(" Error sending notification:", err);
//   //   }
//   // }


//   res.status(201).json({
//     success: true,
//     message: "Booking created successfully",
//     data: booking,
//   }); 
// });

// Create a new booking
exports.createBooking = errorHandle(async (req, res) => {
  const { flatId, userId, ownerId, startTime, endTime, price, captanNumber, captanName, priceNumber, notes, fcmToken } = req.body;

  // Check required fields
  if (!flatId || !userId || !ownerId || !startTime || !endTime || !price || !captanNumber || !captanName || !priceNumber) {
    const error = new Error("All required fields must be provided");
    error.statusCode = 400;
    throw error;
  }

  // Check if flat exists
  const flat = await Flat.findById(flatId);
  if (!flat) {
    const error = new Error("Flat not found");
    error.statusCode = 404;
    throw error;
  }

  // Check if flat is available
  if (flat.status === "not available") {
    const error = new Error("This flat is not available for booking");
    error.statusCode = 400;
    throw error;
  }

  // Create booking
  const booking = await Booking.create({
    flatId,
    userId,
    ownerId,
    startTime,
    endTime,
    price,
    captanNumber,
    captanName,
    priceNumber,
    notes: notes || "", // optional, default empty string
    status: "pending",
  });

  // Mark flat as not available
  flat.status = "not available";
  await flat.save();

//   FCM Notification (to be implemented in the future)
// This block will send a push notification to the user's device when a new booking is created.
// - `fcmToken` is the device token sent from the client app.
// - `message.notification` contains the title and body shown in the notification.
// - `message.data` can include additional info (like bookingId and flatId).
// Currently commented out; will enable once FCM integration is complete.
  // if (fcmToken) {
  //   const message = {
  //     token: fcmToken,
  //     notification: {
  //       title: "New Booking Created 🎉",
  //       body: `Your booking for ${flat.name} is pending approval.`,
  //     },
  //     data: {
  //       bookingId: booking._id.toString(),
  //       flatId: flat._id.toString(),
  //     },
  //   };

  //   try {
  //     await admin.messaging().send(message);
  //     console.log("Notification sent successfully");
  //   } catch (err) {
  //     console.error("Error sending notification:", err);
  //   }
  // }

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});


// Get a single booking by ID
exports.getBookingById = errorHandle(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    const error = new Error("Booking ID is required");
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findById(bookingId)
    .populate("flatId")
    .populate("userId")
    .populate("ownerId");

  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Booking fetched successfully",
    data: booking,
  });
});

// Get all bookings
exports.getAllBookings = errorHandle(async (req, res) => {
  const bookings = await Booking.find()
    .populate("flatId")
    .populate("userId")
    .populate("ownerId");

  if (!bookings || bookings.length === 0) {
    const error = new Error("No bookings found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Bookings fetched successfully",
    data: bookings,
  });
});

// Update booking (e.g., change status)
exports.updateBooking = errorHandle(async (req, res) => {
  const { bookingId, status } = req.body;

  if (!bookingId || !status) {
    const error = new Error("Booking ID and status are required");
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  booking.status = status;
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking updated successfully",
    data: booking,
  });
});

// Delete a booking
exports.deleteBooking = errorHandle(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    const error = new Error("Booking ID is required");
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  await Booking.findByIdAndDelete(bookingId);

  res.status(200).json({
    success: true,
    message: "Booking deleted successfully",
  });
});
