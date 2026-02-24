const express = require('express');
const {  registerStudent, loginStudent, makeAdmin, forgetPassword, verifyOtp, resetPassword, logoutStudent, getStudentCount, getProfile, updateProfile, getCourses, getGrades, getExams, getRecentActivity, registerForCourse, unregisterForCourse, registerForExams, clearExamRegistrations, getLibraryResources, submitSupportRequest } = require('../controller/students.controller.js');
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
router.get('/exams', isAuthenticated, getExams);
router.get('/recent-activity', isAuthenticated, getRecentActivity);
router.post('/courses/register', isAuthenticated, registerForCourse);
router.delete('/courses/unregister', isAuthenticated, unregisterForCourse);
router.post('/exams/register', isAuthenticated, registerForExams);
router.delete('/exams/clear', isAuthenticated, clearExamRegistrations);
router.get('/library', isAuthenticated, getLibraryResources);
router.post('/support', isAuthenticated, submitSupportRequest);

module.exports = router
