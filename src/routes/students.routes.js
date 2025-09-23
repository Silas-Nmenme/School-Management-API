const express = require('express');
const {  registerStudent, loginStudent, makeAdmin, forgetPassword, verifyOtp, resetPassword, logoutStudent, getStudentCount, getProfile, updateProfile, getCourses, getGrades, getRecentActivity } = require('../controller/students.controller.js');
const { isAuthenticated } = require('../middlewares/isAuth.js');
const router = express.Router();



router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.patch('/make-admin/:studentId', makeAdmin); // Assuming studentId is passed in the URL to make a student an admin
router.post('/forget-password', forgetPassword);
router.post('/verify-otp', verifyOtp);
router.put('/reset-password/:studentId', resetPassword);
router.post('/logout', logoutStudent);
router.get('/student-count', getStudentCount);

// New dashboard routes
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, updateProfile);
router.get('/courses', isAuthenticated, getCourses);
router.get('/grades', isAuthenticated, getGrades);
router.get('/recent-activity', isAuthenticated, getRecentActivity);

module.exports = router
