const mongoose = require("mongoose");

// Flat Schema
const flatSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner", // links to Owner
      required: [true, "Owner ID is required"],
    },
    flatName: {
      type: String,
      required: [true, "Flat name is required"],
      trim: true,
    },
    region: {
      type: String,
      required: [true, "Region is required"],
      trim: true,
    },
    district: {
      type: String,
      required: [true, "District is required"],
      trim: true,
    },
    village: {
      type: String,
      required: [true, "Village is required"],
      trim: true,
    },
    startHour: {
      type: String, // store as "HH:mm" or number 0-24
      required: [true, "Start hour is required"],
    },
    endHour: {
      type: String, // store as "HH:mm" or number 0-24
      required: [true, "End hour is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    status: {
      type: String,
      enum: ["available", "not available", "maintenance"],
      default: "available",
    },

    // Ratings summary
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    teamSize:{
    type:  String
    }
  },
  { timestamps: true }
);

// Create the Flat model
const Flat = mongoose.model("Flat", flatSchema);

module.exports = Flat;
