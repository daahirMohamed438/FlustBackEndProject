const { Owner } = require("../model/User.model");
const errorHandle = require("../utils/errorHandler");
const bcrypt = require("bcryptjs");

// Register Owner
exports.registerOwner = errorHandle(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  const existingEmail = await Owner.findOne({ email });
  if (existingEmail) {
    const error = new Error("Email already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const owner = await Owner.create({ name, email, password: hashPassword });

  res.status(201).json({
    success: true,
    message: "Owner registered successfully",
    data: {
      ownerId: owner._id,
      name: owner.name,
      email: owner.email,
    },
  });
});

// Login Owner
exports.loginOwner = errorHandle(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  const owner = await Owner.findOne({ email });
  if (!owner) {
    const error = new Error("Owner not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, owner.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Owner logged in successfully",
    data: {
      ownerId: owner._id,
      name: owner.name,
      email: owner.email,
    },
  });
});

// Update Owner
exports.updateOwner = errorHandle(async (req, res) => {
  const { ownerId, name, email, password } = req.body;

  if (!ownerId || !name || !email || !password) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }

  const owner = await Owner.findById(ownerId);
  if (!owner) {
    const error = new Error("Owner not found");
    error.statusCode = 404;
    throw error;
  }

  const hashPassword = await bcrypt.hash(password, 10);
  owner.name = name;
  owner.email = email;
  owner.password = hashPassword;

  await owner.save();

  res.status(201).json({
    success: true,
    message: "Owner updated successfully",
    data: {
      ownerId: owner._id,
      name: owner.name,
      email: owner.email,
    },
  });
});

// Delete Owner
exports.deleteOwner = errorHandle(async (req, res) => {
  const { ownerId } = req.body;

  if (!ownerId) {
    const error = new Error("Owner ID is required");
    error.statusCode = 400;
    throw error;
  }

  const owner = await Owner.findById(ownerId);
  if (!owner) {
    const error = new Error("Owner not found");
    error.statusCode = 404;
    throw error;
  }

  await Owner.findByIdAndDelete(ownerId);

  res.status(200).json({
    success: true,
    message: "Owner deleted successfully",
  });
});

// Get Owner by ID
exports.getOwner = errorHandle(async (req, res) => {
  const { ownerId } = req.body;

  if (!ownerId) {
    const error = new Error("Owner ID is required");
    error.statusCode = 400;
    throw error;
  }

  const owner = await Owner.findById(ownerId);
  if (!owner) {
    const error = new Error("Owner not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "Owner fetched successfully",
    data: {
      ownerId: owner._id,
      name: owner.name,
      email: owner.email,
      createdAt: owner.createdAt,
      updatedAt: owner.updatedAt,
    },
  });
});

// Get All Owners
exports.getAllOwners = errorHandle(async (req, res) => {
  const owners = await Owner.find();
  if (!owners || owners.length === 0) {
    const error = new Error("No owners found");
    error.statusCode = 404;
    throw error;
  }

  const ownersData = owners.map(owner => ({
    ownerId: owner._id,
    name: owner.name,
    email: owner.email,
    createdAt: owner.createdAt,
    updatedAt: owner.updatedAt,
  }));

  res.status(200).json({
    success: true,
    message: "Owners fetched successfully",
    data: ownersData,
  });
});
