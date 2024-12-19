//backend/routes/authRoutes.js
//(immigrate-forward-dev)

const express = require('express');
const { googleAuth, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/google', googleAuth);

// Redirect route
router.get('/google', (req, res) => {
    res.status(200).send('Google OAuth Redirect URI reached successfully');
});

router.post('/logout', logout);

module.exports = router;
