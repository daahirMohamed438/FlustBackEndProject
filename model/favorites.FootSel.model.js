const mongoose = require("mongoose");

// Store user favorites (wishlist) as individual records to easily ensure uniqueness
const favoriteSchema = new mongoose.Schema(
  {
    
    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can favorite a specific flat only once
favoriteSchema.index({ userId: 1, flatId: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
