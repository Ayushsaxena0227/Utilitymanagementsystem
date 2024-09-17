const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");
const router = express.Router();
const UtilityData = require("../models/UtilityData"); // Adjust path as needed

// PATCH request to update utility data
router.patch("/api/utilitydata/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId, paid } = req.body;

    // Find and update the utility data entry
    const updatedUtilityData = await UtilityData.findByIdAndUpdate(
      id,
      { transactionId, paid },
      { new: true } // Return the updated document
    );

    if (!updatedUtilityData) {
      return res.status(404).send("Utility data not found");
    }

    res.json(updatedUtilityData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
