const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addUtilityData,
  getUtilityData,
  deleteUtilityData,
} = require("../controllers/utilityDataController");
const UtilityDataController = require("../controllers/utilityDataController");

// Add utility data manually
router.post("/", auth, addUtilityData);

// Get utility data
router.get("/", auth, getUtilityData);

router.delete("/:id", auth, deleteUtilityData);

router.patch("/update/:id", UtilityDataController.updateUtilityData);
module.exports = router;
