//backend/controllers/authController.js
//(immigrate-forward-dev)

const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
    const token = req.body.token || req.body.credential; // Handle both `token` and `credential`

    if (!token) {
        console.error("No token received in request body:", req.body); // Log the entire body
        return res.status(400).json({ message: "Token is required" });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleId = payload.sub;
        const name = payload.name;
        const email = payload.email;

        let user = await User.findOne({ googleId });
        if (!user) {
            user = new User({ googleId, name, email });
            await user.save();
        }

        req.session.userId = user._id;
        res.status(200).json({ message: "User authenticated", user });
    } catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).json({ message: "Failed to log out" });
        }
        res.status(200).json({ message: "Logged out" });
    });
};
