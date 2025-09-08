// module.exports = function requireUserId(req, res, next) {
//   if (!req.body || !req.body.userId) {
//     return res.status(400).json({ message: "userId is required in request body" });
//   }
//   next();
// };

// middleware/requireUserId.js
const User = require("../model/User.model");

module.exports = async function requireUserId(req, res, next) {
  try {
    if (!req.body || !req.body.userId) {
      return res
        .status(400)
        .json({ message: "userId is required in request body" });
    }

    const user = await User.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // attach user to request for later use in controllers
    req.user = user;

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

