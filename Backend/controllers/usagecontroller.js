const Usage = require("../models/Usage");

exports.getRecentUsage = async (req, res) => {
  try {
    const userId = req.user._id;
    // Fetch the most recent 5 usage records for the logged-in user
    const recentUsage = await Usage.find({ userId })
      .sort({ endDate: -1 })
      .limit(5);

    if (!recentUsage || recentUsage.length === 0) {
      return res.status(404).json({ message: "No usage data found" });
    }

    res.status(200).json(recentUsage);
  } catch (error) {
    res.status(500).json({ error: "Error fetching recent usage data" });
  }
};
