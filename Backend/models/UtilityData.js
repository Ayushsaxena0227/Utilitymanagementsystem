const mongoose = require("mongoose");

const utilityDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  utilityType: {
    type: String,
    enum: ["water", "gas", "electricity"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  usage: {
    type: Number,
    required: true,
  },
  costPerUnit: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  paid: {
    // New field to indicate payment status
    type: Boolean,
    default: false,
  },
  transactionId: {
    // New field to store transaction ID
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UtilityData = mongoose.model("UtilityData", utilityDataSchema);

module.exports = UtilityData;
