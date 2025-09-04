const mongoose = require("mongoose");

const Booking = require("../model/booking.model");
const errorHandle = require("../utils/errorHandler");
const Flat = require("../model/flat.modet");
const admin = require("../utils/firebase");
const modelfavorites = require("../model/favorites.FootSel.model");

const User = require("../model/User.model");
exports.confirmBooking = errorHandle(async (req, res) => {
  const { bookingId, } = req.body;

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

      // Prevent confirming if already confirmed or canceled

   if (booking.status !== "pending") {
    const error = new Error("This booking cannot be confirmed");
    error.statusCode = 400;
    throw error;
  }

  booking.status = "confirmed";
  await booking.save();
// 1️⃣ Find the  footSel
  const FootselId = await Flat.findById(bookingId.flatId)
  if (!FootselId) {
    const error = new Error("Booking not found");
    error.statusCode = 404;
    throw error;
  }

  FootselId.status = "not available"
  FootselId.status
  await FootselId.save()
  res.status(200).json({
    success: true,
    message: "Booking Status",
    status: booking.status,
  });
});

// User a booking status
exports.bookingStatusByUser = errorHandle(async (req, res) => {
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

  res.status(200).json({
    success: true,
    message: "Booking Status",
    status: booking.status,
  });
});

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
    flat.status = "available";
    await flat.save();
  }

  //   Respond
  res.status(200).json({
    success: true,
    message: "Booking canceled successfully, flat is now available",
    data: booking,
  });
});

// Create a new booking
exports.createBooking = errorHandle(async (req, res) => {
  const {
    flatId,
    userId,
    ownerId,
    startTime,
    endTime,
    price,
    captanNumber,
    captanName,
    priceNumber,
    notes,
    fcmToken,
  } = req.body;

  // Check required fields
  if (
    !flatId ||
    !userId ||
    !ownerId ||
    !startTime ||
    !endTime ||
    !price ||
    !captanNumber ||
    !captanName ||
    !priceNumber
  ) {
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
    // .populate("flatId")
    // .populate("userId")
    // .populate("ownerId");

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

 
// exports.historyBookingUser = errorHandle(async (req, res) => {
//   const { userId, FootselId } = req.body;

//   // Validate input
//   if (!userId || !FootselId) {
//     const error = new Error("User ID and Footsel ID are required");
//     error.statusCode = 400;
//     throw error;
//   }

//   // Fetch bookings for the user and flat
//   const bookings = await Booking.find({
//     userId,
//     flatId: FootselId,
//   })
//     .populate("flatId") // Populate flat details
//     .populate("userId") // Populate user details
//     // .populate("ownerId"); // Populate owner details

//   // Check if bookings exist
//   if (!bookings || bookings.length === 0) {
//     const error = new Error("No bookings found for this user and flat");
//     error.statusCode = 404;
//     throw error;
//   }

//   // Respond with the bookings
//   res.status(200).json({
//     success: true,
//     message: "User booking history fetched successfully",
//     data: bookings,
//   });
// });

exports.historyBookingUser = errorHandle(async (req, res) => {
  const { userId } = req.body;

  // Validate input
  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  // Fetch bookings for the user with populated flat, user, and owner details
  const bookings = await Booking.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "flats", // The name of the Flat collection
        localField: "flatId",
        foreignField: "_id",
        as: "flatDetails",
      },
    },
    {
      $unwind: {
        path: "$flatDetails",
        preserveNullAndEmptyArrays: true, // Optional: if you want to include bookings without flat details
      },
    },
    {
      $lookup: {
        from: "users", // The name of the User collection
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true, // Optional: if you want to include bookings without user details
      },
    },
    {
      $lookup: {
        from: "owners", // The name of the Owner collection
        localField: "ownerId",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    {
      $unwind: {
        path: "$ownerDetails",
        preserveNullAndEmptyArrays: true, // Optional: if you want to include bookings without owner details
      },
    },
    {
      $project: {
        _id: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        price: 1,
        captanNumber: 1,
        captanName: 1,
        priceNumber: 1,
        notes: 1,
        createdAt: 1,
        updatedAt: 1,
        flat: {
          _id: "$flatDetails._id",
          ownerId: "$flatDetails.ownerId",
          flatName: "$flatDetails.flatName",
          region: "$flatDetails.region",
          district: "$flatDetails.district",
          village: "$flatDetails.village",
          startHour: "$flatDetails.startHour",
          endHour: "$flatDetails.endHour",
          price: "$flatDetails.price",
          status: "$flatDetails.status",
          createdAt: "$flatDetails.createdAt",
          updatedAt: "$flatDetails.updatedAt",
        },
        user: {
          _id: "$userDetails._id",
          name: "$userDetails.name",
          email: "$userDetails.email",
        },
        // owner: {
        //   _id: "$ownerDetails._id",
        //   name: "$ownerDetails.name",
        //   email: "$ownerDetails.email",
        // },
      },
    },
  ]);

  // Check if bookings exist
  if (!bookings || bookings.length === 0) {
    const error = new Error("No bookings found for this user");
    error.statusCode = 404;
    throw error;
  }

  // Respond with the bookings
  res.status(200).json({
    success: true,
    message: "User booking history fetched successfully",
    data: bookings,
  });
});


// exports.addFaorite = errorHandle(async(req,res)=>{
//   const { userId, FootselId } = req.body;
//   // Validate input
//   if (!userId ||!FootselId) {
//     const error = new Error("User ID is required");
//     error.statusCode = 400;
//     throw error;
//   }

//   const favorites = await modelfavorites.create({
//     userId,
//     FootselId
//   })


//   // Respond with the bookings
//   res.status(200).json({
//     success: true,
//     message: "User booking history fetched successfully",
//     // data: bookings,
//   });

// })


// exports.getFavorites = errorHandle(async (req, res) => {
//   const { userId } = req.body;

//   if (!userId) {
//     const error = new Error("User ID is required");
//     error.statusCode = 400;
//     throw error;
//   }

//   // const user = await User.findById(userId).populate("favorites");
//   const user = await User.findById(userId).populate('favorites').exec();

//   if (!user) {
//     const error = new Error("User not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   res.status(200).json({
//     success: true,
//     message: "User favorites fetched successfully",
//     data: user.favorites,
//   });
// });
