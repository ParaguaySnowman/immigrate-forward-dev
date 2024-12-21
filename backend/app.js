//backend/app.js
//(immigrate-forward-dev)

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const errorMiddleware = require('./middlewares/errorMiddleware');
require('./config/db');
require('./config/passport-setup'); // Initialize Passport configuration

const app = express();
const PORT = process.env.PORT || 3000;

// CORS setup
const allowedOrigins = [
    'https://immigrate-forward-dev.netlify.app',
    'https://immigrate-forward-dev.onrender.com'
];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(flash());

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI || process.env.MONGODB_URI,
    }),
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set('view engine', 'ejs');

// Custom middleware
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.isAuthenticated && req.isAuthenticated();
    next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
const mainRoutes = require('./routes/mainRoutes');
const requireRegistration = require('./middleware/requireRegistration');

app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/user', requireRegistration, userRoutes);
app.use('/', mainRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Server initialization
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
