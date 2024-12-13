const express = require('express');
const { googleAuth, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/google', googleAuth);
router.post('/logout', logout);

module.exports = router;
