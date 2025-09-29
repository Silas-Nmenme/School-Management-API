require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db.js');
const studentRoutes = require('./src/routes/students.routes.js');
const adminRoutes = require('./src/routes/admin.routes.js');
const applicationsRoutes = require('./src/routes/applications.routes.js');
const contactRoutes = require('./src/routes/contact.routes.js');
const visitRoutes = require('./src/routes/visit.routes.js');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.APP_URL || "https://silasschool.netlify.app";

// CORS Setup
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Student Management API!',
    environment: process.env.NODE_ENV || 'development',
    frontend: FRONTEND_URL,
    status: 'OK'
  });
});

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/visits', visitRoutes);

// Start Server After DB Connect
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Allowed frontend origin: ${FRONTEND_URL}`);
  });
}).catch(err => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});
