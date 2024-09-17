const express = require("express");
const router = express.Router();
const billingController = require("../controllers/billingcontroller");
const usageController = require("../controllers/usagecontroller");
const authMiddleware = require("../middleware/auth");

// Route to get billing reminders
router.get("/reminder", authMiddleware, billingController.getBillingReminder);

// Route to get recent usage
router.get("/usage/recent", authMiddleware, usageController.getRecentUsage);

// Route to add billing data
router.post("/", authMiddleware, billingController.addBilling);

module.exports = router;
