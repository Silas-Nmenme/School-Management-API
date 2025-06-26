const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const connectDB = require('./src/config/db.js');
const studentRoutes = require('./src/routes/students.routes.js');
const adminRoutes = require('./src/routes/admin.routes.js');


dotenv.config();
const app = express();

app.use(express.json())
app.use(morgan('dev'))
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello TechyJAunt Cohort 6, welcome to my student management API!');
})

app.use('/api/students', studentRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    connectDB()
  console.log(`Server is running on port ${PORT}`)
})