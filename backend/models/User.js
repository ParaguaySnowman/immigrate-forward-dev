//backend/models/User.js
//(immigrate-forward-dev)

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true }, // For Google Sign-In
    name: String,
    email: String,
    countryOfOrigin: String,
    yearOfBirth: Number,
    phone: {
        phoneNumber: String,
    },
    smsPreferences: {
        optIn: Boolean,
        preferredLanguage: String,
    },
    isRegistrationComplete: { type: Boolean, default: false },
});


module.exports = mongoose.model('User', userSchema);
