// server.js
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use sessions with MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// User Schema
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// Google Sign-In route
app.post("/auth/google", async (req, res) => {
  const { googleId, name, email } = req.body;

  try {
    let user = await User.findOne({ googleId });

    if (!user) {
      user = new User({ googleId, name, email });
      await user.save();
    }

    req.session.userId = user._id;
    res.status(200).json({ message: "User authenticated", user });
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.status(200).json({ message: "Logged out" });
  });
});

app.use(express.static("."));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
