const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Notification = require("../models/Notification");

// Route to get notifications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({
      userId,
      isRead: false,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching notifications" });
  }
});

// Route to mark notifications as read
router.post("/mark-as-read", authMiddleware, async (req, res) => {
  try {
    const { notificationIds } = req.body;
    await Notification.updateMany(
      { _id: { $in: notificationIds }, userId: req.user._id },
      { isRead: true }
    );
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Error marking notifications as read" });
  }
});

module.exports = router;
