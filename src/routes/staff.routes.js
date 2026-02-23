const express = require('express');
const router = express.Router();
const { staffLogin, getStaffDashboard, listStudentsForStaff, updateStudentRecord, listTeamMembers, changeOwnPassword } = require('../controller/staff.controller.js');
const { isAuthenticated } = require('../middlewares/isAuth.js');

// Staff authentication
router.post('/login', staffLogin);

// Staff dashboard (requires auth)
router.get('/dashboard', isAuthenticated, getStaffDashboard);

// Students (staff-limited)
router.get('/students', isAuthenticated, listStudentsForStaff);
router.put('/students/:id', isAuthenticated, updateStudentRecord);

// Team
router.get('/team', isAuthenticated, listTeamMembers);

// Change own password
router.post('/change-password', isAuthenticated, changeOwnPassword);

module.exports = router;
