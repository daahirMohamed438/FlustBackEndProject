const express = require("express");
const {
  registerarionUser,
  LoginUser,
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  updateUserProfile
} = require("../controller/User.Control");

const router = express.Router();

router.post("/regiterationUser", registerarionUser);
router.post("/loginUser", LoginUser);
router.delete("/deleteUser", deleteUser);
router.put("/updateUser", updateUser);
router.put("/updateUserProfile", updateUserProfile);
router.get("/geteUser", getUser);
router.get("/getAllUsers", getAllUsers);
module.exports = router;  
