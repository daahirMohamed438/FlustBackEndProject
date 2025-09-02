const Booking = require("../model/booking.model");
const errorHandle = require("../utils/errorHandler");
const Flat = require("../model/flat.modet");
 
  
// Create a new booking
exports.createBooking = errorHandle(async (req, res) => {
  const { flatId, userId, ownerId, startDate, endDate, price } = req.body;

  if (!flatId || !userId || !ownerId || !startDate || !endDate || !price) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  // 1️⃣ Check if flat exists
  const flat = await Flat.findById(flatId);
  if (!flat) {
    const error = new Error("Flat not found");
    error.statusCode = 404;
    throw error;
  }

  // 2️⃣ Check if flat is available
  if (flat.status === "rented") {
    const error = new Error("This flat is not available for booking");
    error.statusCode = 400;
    throw error;
  }

  // 3️⃣ Create booking
  const booking = await Booking.create({
    flatId,
    userId,
    ownerId,
    startDate,
    endDate,
    price,
    status: "pending",
  });

  // 4️⃣ Mark flat as not available
  flat.status = "not available";
  await flat.save();

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
