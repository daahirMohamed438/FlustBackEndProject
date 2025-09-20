const errorHandle = require("../utils/errorHandler");
const Favorite = require("../model/favorites.FootSel.model");
const User = require("../model/User.model");
const Flat = require("../model/hoursAvailableFootSel.model");
 
// ✅ Add Favorite
exports.addFavorite = errorHandle(async (req, res) => 
  {
  const { footSelId, flatId } = req.body;

  if (!footSelId || !flatId) {
    const error = new Error("footSelId and flatId are required");
    error.statusCode = 400;
    throw error;
  }

  const flat = await Flat.findById(flatId);
  if (!flat) {
    const error = new Error("Flat not found");
    error.statusCode = 404;
    throw error;
  }

  const favorite = await Favorite.findOneAndUpdate(
    { footSelId, flatId },
    { $setOnInsert: { footSelId, flatId } },
    { upsert: true, new: true }
  );

  res.status(201).json(
    {
    success: true,
    message: "Flat added to favorites",
    data: favorite,
  });
});





// ✅ Remove Favorite
exports.removeFavorite = errorHandle(async (req, res) => {
  const { footSelId, flatId } = req.body;

  if (!footSelId || !flatId) {
    const error = new Error("footSelId and flatId are required");
    error.statusCode = 400;
    throw error;
  }

  const deleted = await Favorite.findOneAndDelete({ footSelId, flatId });
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

// ✅ List Favorites
exports.listFavorites = errorHandle(async (req, res) => {
  const { footSelId } = req.body;

  if (!footSelId) {
    const error = new Error("footSelId is required");
    error.statusCode = 400;
    throw error;
  }

  const favorites = await Favorite.find({ footSelId })
    .populate({ path: "flatId", model: "Flat" });

  res.status(200).json({
    success: true,
    message: "Favorites fetched successfully",
    count: favorites.length,
    data: favorites,
  });
});


