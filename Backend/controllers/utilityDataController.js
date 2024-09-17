const UtilityData = require("../models/UtilityData");
const initPubNub = require("../pubnubInit");
// Add new utility data
exports.addUtilityData = async (req, res) => {
  const { utilityType, startDate, endDate, usage, costPerUnit } = req.body;

  // Calculate the total cost based on usage and cost per unit
  const totalCost = usage * costPerUnit;

  try {
    const newUtilityData = new UtilityData({
      user: req.user.id,
      utilityType,
      startDate,
      endDate,
      usage,
      costPerUnit,
      totalCost,
    });

    const utilityData = await newUtilityData.save();
    res.json(utilityData);
    // Initialize PubNub with the user's ID
    const pubnub = await initPubNub(req.user.id);

    // Send notification if conditions are met
    const highUsage = utilityData.usage > 600;
    const unpaidBills = utilityData.status === "unpaid";

    if (highUsage || unpaidBills) {
      const message = {
        highUsage,
        unpaidBills,
      };

      pubnub.publish(
        {
          channel: `notifications-${req.user.id}`,
          message,
        },
        (status, response) => {
          if (status.error) {
            console.error("PubNub Publish Error:", status);
          } else {
            console.log("PubNub Publish Success:", response);
          }
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all utility data for the logged-in user
exports.getUtilityData = async (req, res) => {
  try {
    const utilityData = await UtilityData.find({ user: req.user.id }).sort({
      startDate: -1,
    });
    res.json(utilityData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete utility data
exports.deleteUtilityData = async (req, res) => {
  try {
    const utilityData = await UtilityData.findByIdAndDelete(req.params.id);

    if (!utilityData) {
      return res.status(404).json({ msg: "Utility data not found" });
    }
    res.json({ msg: "Utility data deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.updateUtilityData = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  console.log("Received PATCH request with ID:", id);
  console.log("Update data:", updateData);

  try {
    const updatedData = await UtilityData.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedData) {
      console.log("Data not found for ID:", id);
      return res.status(404).json({ msg: "Data not found" });
    }
    console.log("Updated data:", updatedData);
    res.json(updatedData);
  } catch (err) {
    console.error("Error updating utility data:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
