const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const auth = require("../middleware/auth");

router.post("/sendReport", auth, async (req, res) => {
  const { utilityType, summary, utilityData } = req.body;
  const userEmail = req.user.email; // Assuming you store the user email in req.user

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: userEmail,
      subject: `${utilityType} Usage Report`,
      html: `
        <h1>${
          utilityType.charAt(0).toUpperCase() + utilityType.slice(1)
        } Usage Report</h1>
        <h2>Summary</h2>
        <p>Total Usage: ${summary.totalUsage}</p>
        <p>Total Cost: $${summary.totalCost.toFixed(2)}</p>
        <h2>Data</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Date</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            ${utilityData
              .map(
                (data) => `
              <tr>
                <td>${new Date(data.date).toLocaleDateString()}</td>
                <td>${data.usage}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: "Report sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Failed to send report", error: error.message });
  }
});

module.exports = router;
