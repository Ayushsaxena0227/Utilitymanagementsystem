const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../models/User"); // Assuming you have a User model
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("Received POST request to /api/sendReport");
  console.log("Request body:", req.body);

  const { utilityType, summary, utilityData } = req.body;

  try {
    // Assuming the user ID is available in the request, otherwise adjust accordingly
    const userId = utilityData[0].user;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const userEmail = user.email;
    console.log("User email:", userEmail);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "saxenaayush381@gmail.com",
        pass: "pxik mxcc mlek cnre", // Replace with your actual email password or use environment variables
      },
    });

    const emailOptions = {
      from: "saxenaayush381@gmail.com",
      to: userEmail,
      subject: `${
        utilityType.charAt(0).toUpperCase() + utilityType.slice(1)
      } Usage Report`,
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
                <td>${new Date(data.startDate).toLocaleDateString()}</td>
                <td>${data.usage}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `,
    };

    console.log("Sending email with options:", emailOptions);

    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.error("Failed to send report:", error);
        return res.status(500).json({ error: "Failed to send report" });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Report sent successfully" });
    });
  } catch (error) {
    console.error("Failed to send report:", error);
    res.status(500).json({ error: "Failed to send report" });
  }
});

module.exports = router;
