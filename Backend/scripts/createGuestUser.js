// Load environment variables from .env file
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Get the Mongo URI from environment variables
const mongoURI = process.env.MONGO_URI;
console.log(process.env.MONGO_URI);
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Database connected");

    const createGuestUser = async () => {
      try {
        const email = "guest@example.com";
        const password = "guest123";
        // const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
          name: "Guest User",
          email,
          password: password,
          role: "guest",
        });

        await user.save();
        console.log("Guest user created");
      } catch (err) {
        console.error("Error creating guest user", err);
      } finally {
        mongoose.connection.close(); // Close the connection after the operation
      }
    };

    createGuestUser();
  })
  .catch((err) => {
    console.error("Database connection error", err);
    process.exit(1); // Exit the process if there's a connection error
  });
