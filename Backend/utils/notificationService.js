const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendReminder = async (email, billingInfo) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Billing Reminder",
      text: `Dear user, your bill for ${billingInfo.utilityType} is due on ${billingInfo.dueDate}. Please make the payment to avoid service interruption.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder sent to ${email}`);
  } catch (error) {
    console.error("Error sending reminder email:", error);
  }
};

module.exports = {
  sendReminder,
};
