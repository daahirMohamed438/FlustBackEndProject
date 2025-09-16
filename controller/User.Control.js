const userModel = require("../model/User.model");
const errorHandle = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // <-- add this
// Favorites moved to dedicated controller
 
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
  const newUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });


  // Generate JWT token
  const token = jwt.sign(
    { id: newUser._id, email: newUser.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
    // Save token in currentToken field
    newUser.currentToken = token;
    await newUser.save();
  //  Respond with created user info (including userId)
  res.status(201).json({
    status: true,
    message: "Successfully registered",
    data: {
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      // token
    },
  });
});

exports.LoginUser = errorHandle(async (req, res) => {
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

  const isMutchPasswod = await bcrypt.compare(password, user.password);
  if (!isMutchPasswod) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }
  // Print old token
  console.log("Old token:", user.currentToken);
    // Generate new token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
  // Print new token
  console.log("New token:", token);
  // Replace old token
  user.currentToken = token;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Successfully logged in",
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      token // include token in response will be delete response
    },
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

// Update personal information (partial updates)
exports.updateUserProfile = errorHandle(async (req, res) => {
  const { userId, name, email, phone, avatarUrl } = req.body;

  if (!userId) {
    const error = new Error("User ID is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      updatedAt: user.updatedAt,
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
