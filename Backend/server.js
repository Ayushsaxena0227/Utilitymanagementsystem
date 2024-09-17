const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const auth = require("./middleware/auth");
const authRoutes = require("./routes/authroute");
const waterRoutes = require("./apis/waterData");
const gasRoutes = require("./apis/gasData");
const electricityRoutes = require("./apis/electricityData");
const userRoutes = require("./routes/authroute");
const billingRoutes = require("./routes/billingroute"); // New route for billing reminders and usage
const BillingReminderService = require("./apis/billingReminderdata"); // Service for billing reminders
const notificationRoutes = require("./routes/notificationRoutes");
const utilityDataRoutes = require("./routes/utilityDataroutes");
const sendReportRoute = require("./routes/sendreport");
const paypalRoutes = require("./routes/paypalRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
require("./db/mongooseconnection");

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/utilityData", utilityDataRoutes);
app.use("/api/waterData", waterRoutes);
app.use("/api/gasData", gasRoutes);
app.use("/api/electricityData", electricityRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/sendReport", sendReportRoute);
app.use("/api/paypal", paypalRoutes);
app.use("/api/payment", paymentRoutes);

// Schedule a task to check for billing reminders daily at midnight
cron.schedule("0 0 * * *", () => {
  BillingReminderService.checkBillingReminders();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
