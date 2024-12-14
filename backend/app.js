require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

//CORS
const allowedOrigins = ['https://immigrate-forward-dev.netlify.app', 'https://immigrate-forward-dev.onrender.com'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

// Routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
