const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const UtilityData = require("../models/UtilityData");
const PubNub = require("pubnub");
const { initPubNub } = require("../pubnubInit");

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    // user.password = await bcrypt.hash(password, salt);

    await user.save();
    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, msg: "User successfully registered" });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// const pubnub = new PubNub({
//   publishKey: "pub-c-8f37cfad-919e-4519-9260-cb77907b1bf4",
//   subscribeKey: "sub-c-81dc4665-6f4f-4788-bc47-18119277bf07",
// });

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password does not match for user:", email);
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Generate a token
    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      async (err, token) => {
        if (err) throw err;

        // Fetch utility data for the user
        const utilityData = await UtilityData.find({ user: user.id });
        const pubnub = await initPubNub(user.id);

        // Determine the status of utility data
        const highUsage = utilityData.some((data) => data.usage > 600);
        const unpaidBills = utilityData.some(
          (data) => data.status === "unpaid"
        );
        console.log("highUsage:", highUsage);
        console.log("unpaidBills:", unpaidBills);

        // Create the message object with conditions
        const message = {
          highUsage: highUsage, // Set true if high usage detected
          unpaidBills: unpaidBills, // Set true if unpaid bills detected
        };

        // Publish message to PubNub
        if (highUsage || unpaidBills) {
          pubnub.publish(
            {
              channel: `notifications-${user.id}`,
              message: message,
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
        res.json({ token, msg: "User successfully logged in" });
      }
    );
  } catch (err) {
    console.error("Error during login:", err.message);
    res.status(500).send("Server error");
  }
};

// Get user data
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Google Sign-In
exports.googleSignIn = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        password: "",
      });

      await user.save();
    }

    const jwtPayload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      jwtPayload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, msg: "User successfully logged in with Google" });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Register or login a user via Google
exports.googleLogin = async (req, res) => {
  const { googleId, email, name } = req.body;

  try {
    let user = await User.findOne({ googleId });
    if (!user) {
      user = new User({
        name,
        email,
        googleId,
      });
      await user.save();
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, msg: "User successfully logged in with Google" });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
