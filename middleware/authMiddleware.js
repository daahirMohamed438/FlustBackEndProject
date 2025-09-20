const jwt = require("jsonwebtoken");
const userModel = require("../model/User.model");
const errorHandle = require("../utils/errorHandler");
const ownersModel = require("../model/User.model")

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


// Fetch a single user by userId

const authMiddlewareBodyByOwner = async (req, res, next) => {
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
    const user = await ownersModel.findById(decoded.id);
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

module.exports = { authMiddlewareBody, authMiddlewareBodyByOwner };

