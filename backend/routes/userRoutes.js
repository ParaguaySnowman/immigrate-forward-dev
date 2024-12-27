const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const User = require('../models/user.model'); // Adjust the path if necessary

// Helper function to render views with layout
function renderWithLayout(res, viewPath, title, additionalData = {}) {
    const viewContent = ejs.render(fs.readFileSync(viewPath, 'utf8'), additionalData);
    res.render('layout', { title, body: viewContent, headerType: 'default' });
}

router.get('/myAccount', async (req, res) => {
    const isLoggedIn = req.isAuthenticated();
  
    try {
        // Find user from database
        const user = await User.findById(req.user._id);
  
        // Pass user data to the view
        renderWithLayout(res, path.join(__dirname, '../views/dashboard.ejs'), 'User Dashboard', { 
            isLoggedIn, 
            message: 'Welcome to the user dashboard!', 
            user 
        });
  
    } catch (error) {
        console.error('Error fetching user data:', error);
        renderWithLayout(res, path.join(__dirname, '../views/error.ejs'), 'Error', { 
            message: 'Could not load user data' 
        });
    }
});

router.get('/editProfile', (req, res) => {
    renderWithLayout(res, path.join(__dirname, '../views/editProfile.ejs'), 'Edit Profile', { 
        isLoggedIn: true, 
        user: req.user 
    });
});

router.post('/editProfile', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
        req.flash('success', 'Profile updated successfully!');
        res.redirect('/user/myAccount');
    } catch (error) {
        console.error('Error updating profile:', error);
        req.flash('error', 'An error occurred while updating your profile.');
        res.redirect('/user/editProfile');
    }
});

module.exports = router;