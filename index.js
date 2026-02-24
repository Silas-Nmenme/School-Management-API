const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db.js');
const studentRoutes = require('./src/routes/students.routes.js');
const adminRoutes = require('./src/routes/admin.routes.js');
const applicationsRoutes = require('./src/routes/applications.routes.js');
const facultyRoutes = require('./src/routes/faculty.routes.js');
const departmentRoutes = require('./src/routes/department.routes.js');
const seedRoutes = require('./src/routes/seed.routes.js');
const contactRoutes = require('./src/routes/contact.routes.js');
const visitRoutes = require('./src/routes/visit.routes.js');
const supportRoutes = require('./src/routes/support.routes.js');
const staffRoutes = require('./src/routes/staff.routes.js');
const { getAllStudents, getAllCourses } = require('./src/controller/admins.controller.js');
const { isAuthenticated } = require('./src/middlewares/isAuth.js');
const { getEmailService } = require("./src/emails/service.js");

const app = express();

// Initialize email service at startup
try {
    getEmailService();
    console.log('✓ Email service initialized at startup');
} catch (error) {
    console.error('✗ Email service initialization failed:', error.message);
}

// Middleware
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.APP_URL || "https://bethelcollege.netlify.app";

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
app.use('/api/faculties', facultyRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/staff', staffRoutes);


// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Allowed frontend origin: ${FRONTEND_URL}`);
  });
}).catch((error) => {
  console.error("MongoDB Connection Failed:", error.message);
  process.exit(1);
});
