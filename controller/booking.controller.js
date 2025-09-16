const mongoose = require("mongoose");

const Booking = require("../model/booking.model");
const errorHandle = require("../utils/errorHandler");
const Flat = require("../model/flat.modet");
const admin = require("../utils/firebase");
const modelfavorites = require("../model/favorites.FootSel.model");
const HoursAvailable = require("../model/hoursAvailableFootSel.model")
const User = require("../model/User.model");


exports.createBooking = errorHandle(async (req, res) => {
  const {
    flatId,
    startTime,
    endTime,
    price,
    userId,
    captanNumber,
    captanName,
    priceNumber,
    notes,
  } = req.body;

  //   Validate required fields
  if (
    !flatId ||
    !startTime ||
    !endTime ||
    !price ||
    !userId ||
    !captanNumber ||
    !captanName ||
    !priceNumber ||
    !notes
  ) {
    const error = new Error("All required fields must be provided");
    error.statusCode = 400;
    throw error;
  }

  //   Check if hours available for this flat
  const availableHours = await HoursAvailable.findById(flatId);
  if (!availableHours) {
    const error = new Error("Selected hours not found");
    error.statusCode = 404;
    throw error;
  }

  if (availableHours.status === "unavailable") {
    const error = new Error("These hours are already booked");
    error.statusCode = 400;
    throw error;
  }

  //  Derive owner from the flat linked to these hours
  const flat = await Flat.findById(availableHours.footSelId);
  if (!flat) {
    const error = new Error("Related flat not found for selected hours");
    error.statusCode = 404;
    throw error;
  }

  //  Create new booking
  const booking = await Booking.create({
    flatId,
    userId,
    ownerId: flat.ownerId,
    startTime,
    endTime,
    price,
    captanNumber,
    captanName,
    priceNumber,
    notes,
    status: "pending", // default
  });

  //  Update availability
  availableHours.status = "unavailable";
  await availableHours.save();

  //   Send response
  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    teamInformation: booking,
    footSelInformation: availableHours,
  });
});

exports.confirmBooking = errorHandle(async (req, res) => {
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

  if (booking.status.trim().toLowerCase() !== "pending") {
    const error = new Error("This booking cannot be confirmed");
    error.statusCode = 400;
    throw error;
  }

  booking.status = "confirmed";
  await booking.save();

  res.status(200).json({
    success: true,
    message: "Booking confirmed successfully",
    // data: booking,
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

  //  Prevent canceling if already canceled
  if (booking.status === "canceled") {
    const error = new Error("This booking is already canceled");
    error.statusCode = 400;
    throw error;
  }
  booking.status = "canceled";
  await booking.save();

   // 3️⃣ Update related HoursAvailable status back to "available"
   const availableHours = await HoursAvailable.findById(booking.flatId);
   if (availableHours) {
     availableHours.status = "available";
     await availableHours.save();
   }
 

  //   Respond
  // res.status(200).json({
  //   success: true,
  //   message: "Booking canceled successfully, flat is now available",
  //   data: booking,
  // });
  res.status(200).json({
    success: true,
    message: "Booking canceled successfully, flat is now available",
    data: booking,
    hoursInfo: availableHours,
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
// exports.getAllBookings = errorHandle(async (req, res) => {
  
//   const bookings = await Booking.find()
//     // .populate("flatId")
//     // .populate("userId")
//     // .populate("ownerId");

//   if (!bookings || bookings.length === 0) {
//     const error = new Error("No bookings found");
//     error.statusCode = 404;
//     throw error;
//   }


//   res.status(200).json({
//     success: true,
//     message: "Bookings fetched successfully",
//     data: bookings,
//   });
// });
// aggregation
exports.getAllBookings = errorHandle(async (req, res) => {
  const bookings = await Booking.aggregate([
    // 1. Join Flats
    {
      $lookup: {
        from: "bookings",           // collection name
        localField: "flatId",    // field in Booking
        foreignField: "_id",     // field in Flats
        as: "flatDetails"        // output array name
      }
    },
    // 2. Flatten the array
    { $unwind: { path: "$flatDetails", preserveNullAndEmptyArrays: true } },

    // 3. Optionally select fields
    {
      $project: {

        _id: 1,
        // startTime: 1,
        // endTime: 1,
        status: 1,
        // price: 1,
        // flatDetails: { name: 1, location: 1, price: 1 }
      }
    }
    
  ]);

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


 

exports.allJoinTables = errorHandle(async (req, res) => {
  const allTables = await Booking.aggregate([
    // 1. Join Flats
    {
      $lookup: {
        from: "flats",
        localField: "flatId",
        foreignField: "_id",
        as: "flatDetails"
      }
    },
    { $unwind: { path: "$flatDetails", preserveNullAndEmptyArrays: true } },

    // 2. Join Owners via flatDetails.ownerId
    {
      $lookup: {
        from: "owners",
        localField: "flatDetails.ownerId", // note: join via the Flat's ownerId
        foreignField: "_id",
        as: "ownerDetails"
      }
    },
    { $unwind: { path: "$ownerDetails", preserveNullAndEmptyArrays: true } },

    // 3. Optionally join HoursAvailable
    {
      $lookup: {
        from: "hoursavailables",
        localField: "flatId",
        foreignField: "footSelId",
        as: "hoursDetails"
      }
    },

    // 4. Project only the needed fields
    {
      $project: {
        _id: 1,
        startTime: 1,
        endTime: 1,
        status: 1,
        price: 1,

        "flatDetails._id": 1,
        "flatDetails.flatName": 1,
        "flatDetails.region": 1,
        "flatDetails.district": 1,

        "hoursDetails.startHours": 1,
        "hoursDetails.endHours": 1,
        "hoursDetails.price": 1,
        "hoursDetails.status": 1,

        "ownerDetails.name": 1,
        "ownerDetails.email": 1
      }
    }
  ]);

  res.status(200).json({
    success: true,
    message: "All tables joined successfully",
    data: allTables,
  });
});


