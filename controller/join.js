const mongoose  = require('mongoose')

const { joinAllTables, showMeBookingInfo } = require('../model/joininigTables')
const User = require('../model/User.model')
const errorHandle = require("../utils/errorHandler");
const { use } = require('../router/joinTableRouters');

//  exports.show = errorHandle(async(req,res)=>{
//   const { bookingId } = req.body;

//   if (!bookingId) {
//     const error = new Error("userId is required");
//     error.statusCode = 400;
//     throw error;
//   }
 

//      const db = await showMeBookingInfo.aggregate([
//     {
//       $lookup: {
//         from: "bookings",       // collection name in MongoDB
//         localField: "bookingId",
//         foreignField: "bookingId",
//         as: "bookingInfo"
//       }
//     },
//     { $unwind: "$userInfo" }
//   ])

//   console.log("xxxxxxx",db)
  
//   if (db.length===0) {
//     const error = new Error("your dont have any booking");
//     error.statusCode = 400;
//     throw error;
//   }
//   res.status(200).json({
//     success: true,
//     message: "All users retrieved successfully",
//     data:db
//     // data: users,
//     // count: users.length
//   });
//  })

exports.show = errorHandle(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    const error = new Error("bookingId is required");
    error.statusCode = 400;
    throw error;
  }

  const db = await mongoose.model('Booking').aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(bookingId) } },
    {
      $lookup: {
        from: 'flats',
        localField: 'flatId',
        foreignField: '_id',
        as: 'flat',
      }
    },
    { $unwind: { path: '$flat', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'owners',
        localField: 'ownerId',
        foreignField: '_id',
        as: 'owner',
      }
    },
    { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
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
          _id: '$flat._id',
          ownerId: '$flat.ownerId',
          flatName: '$flat.flatName',
          region: '$flat.region',
          district: '$flat.district',
          village: '$flat.village',
          startHour: '$flat.startHour',
          endHour: '$flat.endHour',
          price: '$flat.price',
          status: '$flat.status',
          createdAt: '$flat.createdAt',
          updatedAt: '$flat.updatedAt',
        },
        user: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
        },
        owner: {
          _id: '$owner._id',
          name: '$owner.name',
          email: '$owner.email',
        },
      }
    }
  ]);

  if (!db || db.length === 0) {
    return res.status(200).json({ message: "You don't have any booking" });
  }

  res.status(200).json({
    success: true,
    message: "Booking retrieved successfully",
    data: db
  });
});


// Join booking with flat, user, and owner details
exports.joinBookingDetails = errorHandle(async (req, res) => {
  const { bookingId, userId } = req.body;

  if (!bookingId && !userId) {
    const error = new Error("bookingId or userId is required");
    error.statusCode = 400;
    throw error;
  }

  const matchStage = bookingId
    ? { _id: new mongoose.Types.ObjectId(bookingId) }
    : { userId: new mongoose.Types.ObjectId(userId) };

  const result = await mongoose.model('Booking').aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: 'flats',
        localField: 'flatId',
        foreignField: '_id',
        as: 'flat',
      }
    },
    { $unwind: { path: '$flat', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      }
    },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'owners',
        localField: 'ownerId',
        foreignField: '_id',
        as: 'owner',
      }
    },
    { $unwind: { path: '$owner', preserveNullAndEmptyArrays: true } },
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
          _id: '$flat._id',
          ownerId: '$flat.ownerId',
          flatName: '$flat.flatName',
          region: '$flat.region',
          district: '$flat.district',
          village: '$flat.village',
          startHour: '$flat.startHour',
          endHour: '$flat.endHour',
          price: '$flat.price',
          status: '$flat.status',
          createdAt: '$flat.createdAt',
          updatedAt: '$flat.updatedAt',
        },
        user: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
        },
        owner: {
          _id: '$owner._id',
          name: '$owner.name',
          email: '$owner.email',
        },
      }
    }
  ]);

  if (!result || result.length === 0) {
    return res.status(200).json({ message: "You don't have any booking" });
  }

  res.status(200).json({
    success: true,
    message: 'Joined booking details fetched successfully',
    data: result,
  });
});



// exports.joinSomeTables = errorHandle(async(req,res)=>{

//   const {userId}  = req.body
//   if (!userId ) {
//     const error = new Error("userId, flatId and rating are required");
//     error.statusCode = 400;
//     throw error;
//   }

 
//   // const result = await joinAllTables.aggregate([
//   //   { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//   //   {
//   //     $lookup: {
//   //       from: "users",             // collection name in MongoDB
//   //       localField: "userId",      // field in joinedTables
//   //       foreignField: "_id",       // field in users
//   //       as: "userDetails"
//   //     }
//   //   },
//   //   { $unwind: "$userDetails" }   // flatten array
//   // ]);
//   const result = await joinAllTables.aggregate([
//     { $match: { userId: new mongoose.Types.ObjectId(userId) } },
//     {
//       $lookup: {
//         from: "users",             // collection to join with
//         localField: "userId",      // field in joinedTables
//         foreignField: "_id",       // field in users
//         as: "userDetails"
//       }
//     },
//     { $unwind: "$userDetails" },
//     {
//       $project: {
//         _id: 1,
//         date: 1,
//         status: 1,
//         userId: 1,
//         user: {
//           _id: "$userDetails._id",
//           name: "$userDetails.name",
//           email: "$userDetails.email",
//           phone: "$userDetails.phone",
//           avatarUrl: "$userDetails.avatarUrl",
//           createdAt: "$userDetails.createdAt"
//         }
//       }
//     }
//   ]);

//   res.status(200).json({
//     success: true,
//     message: "Joined table data with user information retrieved successfully",
//     data: result,
//     count: result.length
//   })

// })
exports.joinSomeTables = errorHandle(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    const error = new Error("userId is required");
    error.statusCode = 400;
    throw error;
  }

  const result = await joinAllTables.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    { $unwind: "$userDetails" },
    {
      $group: {
        _id: "$userId",
        user: { $first: "$userDetails" }  // take user info once
      }
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        user: {
          name: "$user.name",
          email: "$user.email"
        }
      }
    }
  ]);
  

  res.json(result);
});

// New function to show all users in table format
exports.showAllUsers = errorHandle(async(req, res) => {
  try {
    const users = await User.find({}, {
      name: 1,
      email: 1,
      phone: 1,
      avatarUrl: 1,
      createdAt: 1
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All users retrieved successfully",
      data: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving users",
      error: error.message
    });
  }
})

// Function to get a specific user by ID
exports.getUserById = errorHandle(async(req, res) => {
  const { userId } = req.params;
  
  if (!userId) {
    const error = new Error("userId is required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const user = await User.findById(userId, {
      name: 1,
      email: 1,
      phone: 1,
      avatarUrl: 1,
      createdAt: 1,
      updatedAt: 1
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving user",
      error: error.message
    });
  }
})



