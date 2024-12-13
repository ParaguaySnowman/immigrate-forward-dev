const User = require('../models/User');

exports.googleAuth = async (req, res) => {
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
