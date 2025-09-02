const express = require("express");
const {
  registerOwner,
  loginOwner,
  updateOwner,
  deleteOwner,
  getOwner,
  getAllOwners
} = require("../controller/owner.controller");

const router = express.Router();

// Owner routes
router.post("/registerOwner", registerOwner);
router.post("/loginOwner", loginOwner);
router.put("/updateOwner", updateOwner);
router.delete("/deleteOwner", deleteOwner);
router.get("/getOwner", getOwner);
router.get("/getAllOwners", getAllOwners);

module.exports = router;
