const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { getUser } = require("../controllers/userController");
const auth = require("../middleware/auth");

// Register a new user
router.post("/register", userController.registerUser);

// Login a user
router.post("/login", userController.loginUser);

router.get("/userinfo", auth, getUser);

// Google Sign-In
router.post("/google-signin", userController.googleSignIn);

router.post("/google-login", userController.googleLogin);

module.exports = router;
