// backend/routes/utilityData.js
const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const UtilityData = require("../models/UtilityData");
const router = express.Router();

// Add new utility data
router.post(
  "/",
  [
    auth,
    [
      check("utilityType", "Utility type is required").not().isEmpty(),
      check("date", "Date is required").not().isEmpty(),
      check("usage", "Usage amount is required").isNumeric(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { utilityType, date, usage } = req.body;

    try {
      const newUtilityData = new UtilityData({
        user: req.user.id,
        utilityType,
        date,
        usage,
      });

      const utilityData = await newUtilityData.save();
      res.json(utilityData);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/limited", auth, async (req, res) => {
  const { limit = 5 } = req.query; // Default limit to 5 if not provided
  try {
    const utilityData = await UtilityData.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(parseInt(limit));
    console.log("Limited Data:", utilityData);
    res.json(utilityData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all utility data for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const utilityData = await UtilityData.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(utilityData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update utility data entry
router.put("/:id", auth, async (req, res) => {
  const { utilityType, date, usage } = req.body;

  const updatedData = { utilityType, date, usage };

  try {
    let utilityData = await UtilityData.findById(req.params.id);

    if (!utilityData) {
      return res.status(404).json({ msg: "Utility data not found" });
    }

    // Ensure user owns the data
    if (utilityData.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    utilityData = await UtilityData.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );

    res.json(utilityData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.delete("/:utilityType/:id", auth, async (req, res) => {
  const { utilityType, id } = req.params;

  try {
    const utility = await UtilityData.findOneAndDelete({
      _id: id,
      utilityType: utilityType, // Corrected field name
    });

    if (!utility) {
      return res.status(404).json({ msg: "Resource not found" });
    }

    res.json({ msg: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
