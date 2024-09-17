const Billing = require("../models/Billing");
const BillingReminderService = require("../apis/billingReminderdata");

exports.getBillingReminder = async (req, res) => {
  try {
    const userId = req.user._id;
    const billingInfo = await BillingReminderService.getBillingInfo(userId);

    if (!billingInfo) {
      return res.status(404).json({ message: "No billing information found" });
    }

    res.status(200).json(billingInfo);
  } catch (error) {
    res.status(500).json({ error: "Error fetching billing reminder" });
  }
};

exports.addBilling = async (req, res) => {
  try {
    const { dueDate, amount } = req.body;
    const billing = new Billing({
      userId: req.user._id,
      dueDate,
      amount,
    });

    await billing.save();
    res.status(201).json(billing);
  } catch (error) {
    res.status(500).json({ error: "Error adding billing data" });
  }
};
