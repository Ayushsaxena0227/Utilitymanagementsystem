const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema(
  {
    userId: {
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
  },
  { timestamps: true }
);

const Usage = mongoose.model("Usage", usageSchema);

module.exports = Usage;
