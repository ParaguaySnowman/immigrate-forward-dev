const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
    const { token } = req.body; // Expect token from frontend

    try {
        // Verify the token with Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        // Extract payload from the token
        const payload = ticket.getPayload();
        const googleId = payload.sub; // Google's unique user ID
        const name = payload.name;
        const email = payload.email;

        if (!googleId || !name || !email) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }

        // Check if the user exists or create a new one
        let user = await User.findOne({ googleId });
        if (!user) {
            user = new User({ googleId, name, email });
            await user.save();
        }

        req.session.userId = user._id; // Optional: if using session for login state
        res.status(200).json({ message: 'User authenticated', user });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
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
