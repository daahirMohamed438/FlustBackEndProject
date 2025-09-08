const mongoose =  require("mongoose")

const errorHandle = require("../utils/errorHandler");
const HoursAvailable = require("../model/hoursAvailableFootSel.model")
const footSel = require("../model/flat.modet"); // Import Flat model

exports.createAvailableHours = errorHandle(async(req,res)=>{
const {startHours,endHours,price,footSelId } =  req.body

if (!startHours|| !endHours|| !price|| !footSelId) {
    const error = new Error("requeired all fields");
    error.statusCode = 400;
    throw error;
  }

  const getFootSel = await footSel.findById(footSelId)

if (!getFootSel ) {
    const error = new Error("your don't have any footsel");
    error.statusCode = 400;
    throw error;
  }

  // store hrs available

  const newhrsAvailable = await HoursAvailable.create({
    startHours,
    endHours,
    price,
    footSelId,

    flatName: getFootSel.flatName,
    region: getFootSel.region,
    district: getFootSel.district,
    village: getFootSel.village,
    startHour: getFootSel.startHour,
    endHour: getFootSel.endHour,
  })

  res.status(201).json({
    success:true,
    message:"Created successfully",
    data: newhrsAvailable

  })
})


// Fetch all hours available
exports.getAllHoursAvailable = errorHandle(async (req, res) => {
  const hours = await HoursAvailable.find()
    .populate("footSelId", "_id flatName region district village startHour endHour   ratingAverage ratingCount ownerId") // ma xulayo 'status', 'createdAt', 'updatedAt', '__v'
    .sort({ district: 1 });

  res.status(200).json({
    success: true,
    count: hours.length,
    data: hours,
  });
});

  
 exports.getHoursByFlatId = errorHandle(async (req, res) => {
  const { footSelId } = req.body; // get ID from body

  if (!footSelId) {
    const error = new Error("footSelId is required in request body");
    error.statusCode = 400;
    throw error;
  }

  const hours = await HoursAvailable.find({ footSelId })
  .populate("footSelId", "_id flatName region district village") // only select needed fields
  .sort({ startHours: 1 });

  if (!hours || hours.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No hours found for this flat",
    });
  }

  res.status(200).json({
    success: true,
    count: hours.length,
    data: hours,
  });
});
 
//   const { footSelId } = req.body; // get ID from body

//   if (!footSelId) {
//     const error = new Error("footSelId is required in request body");
//     error.statusCode = 400;
//     throw error;
//   }

//   const hours = await HoursAvailable.aggregate([
//     // Match the specific flat
//     { $match: { footSelId: new mongoose.Types.ObjectId(footSelId) } },

//     // Lookup Flat details
//     {
//       $lookup: {
//         from: "flats",           // collection name in MongoDB
//         localField: "footSelId",
//         foreignField: "_id",
//         as: "flatInfo"
//       }
//     },

//     // Unwind array created by lookup
//     { $unwind: "$flatInfo" },

//     // Project only the fields you want
//     {
//       $project: {
//         startHours: 1,
//         endHours: 1,
//         price: 1,
//         status: 1,
//         "flatInfo._id": 1,
//         "flatInfo.flatName": 1,
//         "flatInfo.region": 1,
//         "flatInfo.district": 1,
//         "flatInfo.village": 1,
//         "flatInfo.ratingCount": 1
//       }
//     },

//     // Sort by startHours
//     { $sort: { startHours: 1 } }
//   ]);

//   if (!hours || hours.length === 0) {
//     return res.status(404).json({
//       success: false,
//       message: "No hours found for this flat",
//     });
//   }

//   res.status(200).json({
//     success: true,
//     count: hours.length,
//     data: hours,
//   });
// });





exports.updateAvailableHours = errorHandle(async (req, res) => {
  const { id, startHours, endHours, price, footSelId } = req.body;

  if (!id) {
    const error = new Error("HoursAvailable id is required");
    error.statusCode = 400;
    throw error;
  }

  if (!startHours && !endHours && !price && !footSelId) {
    const error = new Error("At least one field must be provided to update");
    error.statusCode = 400;
    throw error;
  }

  // Find the document to update
  const hoursAvailable = await HoursAvailable.findById(id);
  if (!hoursAvailable) {
    const error = new Error("HoursAvailable not found");
    error.statusCode = 404;
    throw error;
  }

  // If footSelId is updated, get the new flat info
  if (footSelId) {
    const getFootSel = await footSel.findById(footSelId);
    if (!getFootSel) {
      const error = new Error("Flat not found for the provided footSelId");
      error.statusCode = 404;
      throw error;
    }

    hoursAvailable.footSelId = footSelId;
    hoursAvailable.flatName = getFootSel.flatName;
    hoursAvailable.region = getFootSel.region;
    hoursAvailable.district = getFootSel.district;
    hoursAvailable.village = getFootSel.village;
    hoursAvailable.startHour = getFootSel.startHour;
    hoursAvailable.endHour = getFootSel.endHour;
  }

  // Update other fields if provided
  if (startHours) hoursAvailable.startHours = startHours;
  if (endHours) hoursAvailable.endHours = endHours;
  if (price) hoursAvailable.price = price;

  // Save updates
  await hoursAvailable.save();

  res.status(200).json({
    success: true,
    message: "HoursAvailable updated successfully",
    data: hoursAvailable,
  });
});

