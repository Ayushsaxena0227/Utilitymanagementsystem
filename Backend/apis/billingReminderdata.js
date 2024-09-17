const Billing = require("../models/Billing");
const User = require("../models/User");
const Notification = require("../models/Notification"); // New model for notifications
const { sendReminder } = require("../utils/notificationService");

class BillingReminderService {
  static async checkBillingReminders() {
    try {
      const users = await User.find({});

      users.forEach(async (user) => {
        const billingInfo = await Billing.findOne({ userId: user._id });

        if (billingInfo) {
          const currentDate = new Date();
          const dueDate = new Date(billingInfo.dueDate);

          // Check if reminder needs to be sent (e.g., 7 days before due date)
          if (
            dueDate.getTime() - currentDate.getTime() <=
            7 * 24 * 60 * 60 * 1000
          ) {
            // Send email reminder
            sendReminder(user.email, billingInfo);

            // Store notification for the dashboard
            const notification = new Notification({
              userId: user._id,
              message: `Your bill for ${billingInfo.utilityType} is due on ${billingInfo.dueDate}.`,
              type: "billing_reminder",
              createdAt: new Date(),
              isRead: false,
            });

            await notification.save();
          }
        }
      });
    } catch (error) {
      console.error("Error checking billing reminders:", error);
    }
  }

  static async getBillingInfo(userId) {
    try {
      const billingInfo = await Billing.findOne({ userId });
      return billingInfo;
    } catch (error) {
      throw new Error("Error fetching billing info");
    }
  }
}

module.exports = BillingReminderService;
