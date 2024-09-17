const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

// Register a new user
router.post("/", registerUser);

// Login a user
router.post("/auth", loginUser);

// Get user data
router.get("/", auth, getUser);

module.exports = router;
