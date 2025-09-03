const userModel = require("../model/User.model");
const errorHandle = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");
 
exports.registerarionUser = errorHandle(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  // Check for existing email
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  //  Respond with created user info (including userId)
  res.status(201).json({
    status: true,
    message: "Successfully registered",
    data: {
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
    },
  });
});

exports.LoginUser = errorHandle(async (req, res) => {
  //Input Validation
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isMutchPasswod = await bcrypt.compare(password, user.hashPassword);
  if (!isMutchPasswod) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  // Calculate user rating from reviews
  const reviews = await reviewModel.find({ userId: user._id });
  let averageRating = 0;
  let reviewCount = 0;
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    averageRating = totalRating / reviews.length;
    reviewCount = reviews.length;
  }

  // Update user's rating and review count
  user.rating = Math.round(averageRating * 10) / 10; // Round to 1 decimal place
  user.reviewCount = reviewCount;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Successfully logged in",
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      rating: user.rating,
      reviewCount: user.reviewCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  });
});

exports.updateUser = errorHandle(async (req, res) => {
  const { userId, name, email, password } = req.body;
  // Input Validation
  if (!userId || !name || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  // Check if user exists
  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Hash the new password
  const hashPassword = await bcrypt.hash(password, 10);
  // Update User Details
  user.name = name;
  user.email = email;
  user.password = hashPassword;

  // Save Updated User

  await user.save();
  res.status(201).json({
    success: true,
    message: "successfuly update",
    data: {
      userId: user._id,
      name: user.name,
      password: user.password,
    },
  });
});

// exports.deleteUser = errorHandle(async (req, res) => {
//   // input
//     const { userId } = req.body; //  now userId is a string

//   console.log("Received userId:", userId)

//   if (!userId) {
//     const error = new Error("All fireld is requeired");
//     error.statusCode = 400;
//     throw error;
//   }
//   const isUserId = await userModel.findById({ userId });
//   if (!isUserId) {
//     const error = new Error("not resgiterd this user  ");
//     error.statusCode = 400;
//     throw error;
//   }

//   // Delete User
//   await userModel.findByIdAndDelete(userId);

//    res.status(201).json({
//     success: true,
//     message: "succesfuly deleter ",

//   });
// });

exports.deleteUser = errorHandle(async (req, res) => {
  const { userId } = req.body; // Extract the string

  console.log("Received userId:", userId);

  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error("User not registered");
    error.statusCode = 404;
    throw error;
  }

  await userModel.findByIdAndDelete(userId);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

exports.getUser = errorHandle(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error("User not registered");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      rating: user.rating,
      reviewCount: user.reviewCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
});

exports.getAllUsers = errorHandle(async (req, res) => {
  const users = await userModel.find();
  if (!users || users.length === 0) {
    const error = new Error("No users found");
    error.statusCode = 404;
    throw error;
  }

    // Return users without passwords
    const usersData = users.map(user => ({
      userId: user._id,
      name: user.name,
      email: user.email,
      rating: user.rating,
      reviewCount: user.reviewCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: usersData,
    });
  
});
