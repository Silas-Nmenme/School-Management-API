const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const morgan = require('morgan')
const connectDB = require('./src/config/db.js');
const studentRoutes = require('./src/routes/students.routes.js');
const adminRoutes = require('./src/routes/admin.routes.js');


dotenv.config();
const app = express();

app.use(express.json())
app.use(morgan('dev'))
const PORT = process.env.PORT || 3000;

// ===== CORS Setup =====
const FRONTEND_URL = process.env.FRONTEND_URL || "https://silasschool.netlify.app";
app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello TechyJAunt Cohort 6, welcome to my student management API!');
})

app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);

// ===== Start Server After DB Connect =====
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Allowed frontend origin: ${FRONTEND_URL}`);
  });
}).catch(err => {
  console.error("MongoDB connection failed:", err.message);
  process.exit(1);
});
