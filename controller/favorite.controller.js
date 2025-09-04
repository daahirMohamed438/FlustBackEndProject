const errorHandle = require("../utils/errorHandler");
const Favorite = require("../model/favorites.FootSel.model");
const User = require("../model/User.model");
const Flat = require("../model/flat.modet");

exports.addFavorite = errorHandle(async (req, res) => {
  const { userId, flatId } = req.body;

  if (!userId || !flatId) {
    const error = new Error("userId and flatId are required");
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

  const favorite = await Favorite.findOneAndUpdate(
    { userId, flatId },
    { $setOnInsert: { userId, flatId } },
    { upsert: true, new: true }
  );

  res.status(201).json({
    success: true,
    message: "Flat added to favorites",
    data: favorite,
  });
});

exports.removeFavorite = errorHandle(async (req, res) => {
  const { userId, flatId } = req.body;

  if (!userId || !flatId) {
    const error = new Error("userId and flatId are required");
    error.statusCode = 400;
    throw error;
  }

  const deleted = await Favorite.findOneAndDelete({ userId, flatId });
  if (!deleted) {
    const error = new Error("Favorite not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Flat removed from favorites",
  });
});

exports.listFavorites = errorHandle(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    const error = new Error("userId is required");
    error.statusCode = 400;
    throw error;
  }

  const favorites = await Favorite.find({ userId }).populate({ path: "flatId", model: "Flat" });

  res.status(200).json({
    success: true,
    message: "Favorites fetched successfully",
    count: favorites.length,
    data: favorites,
  });
});


