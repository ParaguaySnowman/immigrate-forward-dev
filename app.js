// app.js

const bodyParser = require("body-parser");
const cors = require('cors');
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const nodemailer = require('nodemailer');
const session = require("express-session");

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// frontend resources served from root directory for now
app.use(express.static("."));

// log incoming requests to the server
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
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

// POST route to handle contact form submission
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send('All fields are required!');
    }

    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'trainersnowman@gmail.com', // Replace with your email
                pass: 'lvgc htwc ljyj ygdm', // Replace with your email password or app-specific password
            },
        });

        // Define email options
        const mailOptions = {
            from: email,
            to: 'parker.b.mortensen@gmail.com', // Replace with your receiving email
            subject: `Contact Form Submission from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).send('Message sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error sending message. Please try again later.');
    }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
