const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    if (!MONGODB_URI || typeof MONGODB_URI !== 'string') {
        throw new Error('MongoDB URI is missing or not a string');
    }
    // Connect immediately, no extra options or messages
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
};

module.exports = connectDB;

