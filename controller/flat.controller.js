const Flat = require("../model/flat.modet"); // Import Flat model
const errorHandle = require("../utils/errorHandler");

// Register a new Flat
exports.registerFlat = errorHandle(async (req, res) => {
  const { ownerId, flatName, region, district, village, startHour, endHour, price, status } = req.body;

  if (!ownerId || !flatName || !region || !district || !village || !startHour || !endHour || !price) {
    const error = new Error("All required fields must be provided");
    error.statusCode = 400;
    throw error;
  }

  const flat = await Flat.create({
    ownerId,
    flatName,
    region,
    district,
    village,
    startHour,
    endHour,
    price,
    status: status || "available",
  });

  res.status(201).json({
    success: true,
    message: "Flat registered successfully",
    data: flat,
  });
});

// Get a single flat by ID
exports.getFlatByID = errorHandle(async (req, res) => {
  const { flatId } = req.body;
  if (!flatId) {
    const error = new Error("Flat ID is required");
    error.statusCode = 400;
    throw error;
  }

  const flat = await Flat.findById(flatId);
  if (!flat) {
    const error = new Error("Flat not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Flat fetched successfully",
    data: flat,
  });
});

// Get all flats
// exports.getAllFlats = errorHandle(async (req, res) => {
//   const flats = await Flat.find();
//   if (!flats || flats.length === 0) {
//     const error = new Error("No flats found");
//     error.statusCode = 404;
//     throw error;
//   }

//   res.status(200).json({
//     success: true,
//     message: "Flats fetched successfully",
//     data: flats,
//   });
// });

// Get all flats sorted by availability
exports.getAllFlats = errorHandle(async (req, res) => {
  // Sort: available flats first, then others
  const flats = await Flat.find().sort({ status: 1 }); // 1 = ascending

  if (!flats || flats.length === 0) {
    const error = new Error("No flats found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Flats fetched successfully",
    data: flats,
  });
});


// Update a flat
exports.updateFlat = errorHandle(async (req, res) => {
  const { flatId, flatName, region, district, village, startHour, endHour, price, status } = req.body;

  if (!flatId) {
    const error = new Error("Flat ID is required");
    error.statusCode = 400;
    throw error;
  }

  const flat = await Flat.findById(flatId);
  if (!flat) {
    const error = new Error("Flat not found");
    error.statusCode = 404;
    throw error;
  }

  // Update fields
  flat.flatName = flatName || flat.flatName;
  flat.region = region || flat.region;
  flat.district = district || flat.district;
  flat.village = village || flat.village;
  flat.startHour = startHour || flat.startHour;
  flat.endHour = endHour || flat.endHour;
  flat.price = price || flat.price;
  flat.status = status || flat.status;

  await flat.save();

  res.status(200).json({
    success: true,
    message: "Flat updated successfully",
    data: flat,
  });
});

// Delete a flat
exports.deleteFlat = errorHandle(async (req, res) => {
  const { flatId } = req.body;
  if (!flatId) {
    const error = new Error("Flat ID is required");
    error.statusCode = 400;
    throw error;
  }

  const flat = await Flat.findById(flatId);
  if (!flat) {
    const error = new Error("Flat not found");
    error.statusCode = 404;
    throw error;
  }

  await Flat.findByIdAndDelete(flatId);

  res.status(200).json({
    success: true,
    message: "Flat deleted successfully",
  });
});



// only availbe

// Get all available flats
exports.getAvailableFlats = errorHandle(async (req, res) => {
  const availableFlats = await Flat.find({ status: "available" });

  if (!availableFlats || availableFlats.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No available flats found",
      count: 0,
    });
  }

  res.status(200).json({
    success: true,
    count: availableFlats.length, // total number of available flats
    data: availableFlats,
  });
});