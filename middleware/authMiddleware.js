const jwt = require("jsonwebtoken");
const userModel = require("../model/User.model");
const errorHandle = require("../utils/errorHandler");

const authMiddlewareBody = async (req, res, next) => {
  try {
    const { token } = req.body; // token comes from request body

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is required",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user using decoded id
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Ensure token matches currentToken
    if (user.currentToken !== token) { 
      return res.status(401).json({
        success: false,
        message: "Token invalid: user logged in elsewhere",
      });
    }

    // Attach user info to request
    req.user = user;
    req.token = token;

    next(); // continue to next middleware/controller
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = authMiddlewareBody;


// Fetch a single user by userId
exports.fetchUserById = errorHandle(async (req, res) => {
  const { userId } = req.body; // or req.params.userId if using URL param

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  const user = await userModel.findById(userId).select("-password -currentToken");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});
