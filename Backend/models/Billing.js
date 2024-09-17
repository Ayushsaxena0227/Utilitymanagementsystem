const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BillingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Unpaid",
  },
});

module.exports = mongoose.model("Billing", BillingSchema);
