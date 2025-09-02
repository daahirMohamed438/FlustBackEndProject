// utils/errorHandler.js
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error("Error:", err.message);
      res.status(err.statusCode || 500).json({
        message: err.message || "Something went wrong",
      });
    });
  };
  
  module.exports = asyncHandler;

  exports.asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      console.error("Error:", err.message);
      res.status(err.statusCode || 500).json({
        message: err.message || "Something went wrong",
      });
    });
  };
  