const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const UtilityData = require("../models/UtilityData");
const { check, validationResult } = require("express-validator");

// Add new electricity data
router.post(
  "/",
  [
    auth,
    [
      check("startDate", "Start date is required").not().isEmpty(),
      check("endDate", "End date is required").not().isEmpty(),
      check("usage", "Usage amount is required")
        .isNumeric()
        .withMessage("Usage must be a number"),
      check("costPerUnit", "Cost per unit is required")
        .isNumeric()
        .withMessage("Cost per unit must be a number"),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { startDate, endDate, usage, costPerUnit } = req.body;

    // Calculate total cost based on usage and cost per unit
    const totalCost = usage * costPerUnit;

    try {
      const newData = new UtilityData({
        user: req.user.id,
        utilityType: "electricity",
        startDate,
        endDate,
        usage,
        costPerUnit,
        totalCost,
      });

      const savedData = await newData.save();
      res.json(savedData);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// Get all electricity data for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const data = await UtilityData.find({
      user: req.user.id,
      utilityType: "electricity",
    }).sort({ startDate: -1 });
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
