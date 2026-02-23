const express = require('express');
const router = express.Router();
const { staffLogin, getStaffDashboard } = require('../controller/staff.controller.js');
const { isAuthenticated } = require('../middlewares/isAuth.js');

// Staff authentication
router.post('/login', staffLogin);

// Staff dashboard (requires auth)
router.get('/dashboard', isAuthenticated, getStaffDashboard);

module.exports = router;
