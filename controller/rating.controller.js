const errorHandle = require("../utils/errorHandler");
const Rating = require("../model/rating.model");
const Flat = require("../model/flat.modet");
const User = require("../model/User.model");

async function recomputeFlatRating(flatId) {
  const stats = await Rating.aggregate([
    { $match: { flatId: typeof flatId === 'string' ? require('mongoose').Types.ObjectId(flatId) : flatId } },
    { $group: { _id: "$flatId", avg: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Flat.findByIdAndUpdate(flatId, {
    ratingAverage: Math.round(avg * 10) / 10,
    ratingCount: count,
  });
}

// Add a new rating (fails if already exists)
exports.addRating = errorHandle(async (req, res) => {
  const { userId, flatId, rating, comment } = req.body;

  if (!userId || !flatId || !rating) {
    const error = new Error("userId, flatId and rating are required");
    error.statusCode = 400;
    throw error;
  }

  if (rating < 1 || rating > 5) {
    const error = new Error("rating must be between 1 and 5");
    error.statusCode = 400;
    throw error;
  }

  const [user, flat] = await Promise.all([
    User.findById(userId),
    Flat.findById(flatId),
  ]);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  if (!flat) {
    const error = new Error("Flat not found");
    error.statusCode = 404;
    throw error;
  }

  // Ensure not rated before
  const exists = await Rating.findOne({ userId, flatId });
  if (exists) {
    const error = new Error("Rating already exists. Use updateRating.");
    error.statusCode = 400;
    throw error;
  }

  const doc = await Rating.create({ userId, flatId, rating, comment });

  await recomputeFlatRating(flatId);

  res.status(201).json({
    success: true,
    message: "Rating added",
    data: doc,
  });
});

// Update an existing rating
exports.updateRating = errorHandle(async (req, res) => {
  const { userId, flatId, rating, comment } = req.body;

  if (!userId || !flatId || !rating) {
    const error = new Error("userId, flatId and rating are required");
    error.statusCode = 400;
    throw error;
  }

  if (rating < 1 || rating > 5) {
    const error = new Error("rating must be between 1 and 5");
    error.statusCode = 400;
    throw error;
  }

  const updated = await Rating.findOneAndUpdate(
    { userId, flatId },
    { $set: { rating, comment } },
    { new: true }
  );
  if (!updated) {
    const error = new Error("Rating not found. Use addRating.");
    error.statusCode = 404;
    throw error;
  }

  await recomputeFlatRating(flatId);

  res.status(200).json({ success: true, message: "Rating updated", data: updated });
});

exports.getRatingsByFlat = errorHandle(async (req, res) => {
  const { flatId } = req.body;
  if (!flatId) {
    const error = new Error("flatId is required");
    error.statusCode = 400;
    throw error;
  }
  const ratings = await Rating.find({ flatId }).populate({ path: 'userId', model: 'User', select: 'name email' });
  res.status(200).json({ success: true, count: ratings.length, data: ratings });
});

exports.getRatingSummary = errorHandle(async (req, res) => {
  const { flatId } = req.body;
  if (!flatId) {
    const error = new Error("flatId is required");
    error.statusCode = 400;
    throw error;
  }
  const flat = await Flat.findById(flatId).select('ratingAverage ratingCount');
  if (!flat) {
    const error = new Error("Flat not found");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ success: true, data: { ratingAverage: flat.ratingAverage, ratingCount: flat.ratingCount } });
});


