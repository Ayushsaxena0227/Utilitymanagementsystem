const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("./db/mongooseconnection");
const User = require("./models/User");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

dotenv.config();
const app = express();

// Middlewares
// app.use(
//   cors({
//     origin: ["http://localhost:5174"],
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );

app.use(cors());

app.use(express.json());
app.use(
  session({
    secret: "12243647fdvgbgcxfvxcbgvcx",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Ensure this is set to false for development (change to true in production with HTTPS)
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get(
  "/auth/google/callback",
  (req, res, next) => {
    console.log("Callback from Google");
    next();
  },
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5174/login",
  }),
  (req, res) => {
    console.log("User authenticated, redirecting to dashboard");
    console.log("User:", req.user); // Check if user is authenticated
    res.redirect("http://localhost:5174/dashboard");
  }
);

app.use("/api/utilityData", require("./routes/utilityDataroutes"));
app.use("/api/waterData", require("./apis/waterData"));
app.use("/api/gasData", require("./apis/gasData"));
app.use("/api/electricityData", require("./apis/electricityData"));
app.use("/api/user", require("./routes/authroute"));
app.use("/api/auth", require("./routes/authroute"));
app.use("/api/billing", require("./routes/billingroute"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/sendReport", require("./routes/sendreport"));
app.use("/api/paypal", require("./routes/paypalRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/auth", require("./routes/googleauth"));

// Schedule a task to check for billing reminders daily at midnight
cron.schedule("0 0 * * *", () => {
  require("./apis/billingReminderdata").checkBillingReminders();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
