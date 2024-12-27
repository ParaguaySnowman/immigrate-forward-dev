//backend/app.js
//(immigrate-forward-dev)

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// CORS setup
const allowedOrigins = ['https://immigrate-forward-dev.netlify.app', 'https://immigrate-forward-dev.onrender.com'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
}));

// View engine setup
app.set('view engine', 'ejs');

// Routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');
const mainRoutes = require('./routes/mainRoutes');

app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/user', userRoutes); // Preserved 'immigrate-forward4' functionality
app.use('/', mainRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Server initialization
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
