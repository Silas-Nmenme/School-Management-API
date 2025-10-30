const express = require('express');
const router = express.Router();
const {
    addStudent, editStudent, deleteStudent, getAllStudents,
    addStaff, editStaff, deleteStaff, getAllStaff,
    addCourse, editCourse, deleteCourse, getAllCourses,
    generateStudentReport, generateCourseAnalytics,
    getDashboardOverview,
    adminRegister, adminLogin
} = require('../controller/admins.controller.js');
const {isAuthenticated} = require('../middlewares/isAuth.js');

// Student Management Routes
router.post('/add-student', isAuthenticated, addStudent);
router.put('/edit-student/:id', isAuthenticated, editStudent);
router.delete('/delete-student/:id', isAuthenticated, deleteStudent);
router.get('/get-all-students', isAuthenticated, getAllStudents);

// Staff Management Routes
router.post('/add-staff', isAuthenticated, addStaff);
router.put('/edit-staff/:staffId', isAuthenticated, editStaff);
router.delete('/delete-staff/:staffId', isAuthenticated, deleteStaff);
router.get('/get-all-staff', isAuthenticated, getAllStaff);

// Course Management Routes
router.post('/add-course', isAuthenticated, addCourse);
router.put('/edit-course/:courseId', isAuthenticated, editCourse);
router.delete('/delete-course/:courseId', isAuthenticated, deleteCourse);
router.get('/get-all-courses', isAuthenticated, getAllCourses);

// Reports Routes
router.get('/reports/students', isAuthenticated, generateStudentReport);
router.get('/reports/courses', isAuthenticated, generateCourseAnalytics);


// Dashboard Routes
router.get('/dashboard/overview', isAuthenticated, getDashboardOverview);

// Admin Authentication Routes
router.post('/register', adminRegister);
router.post('/login', adminLogin);

module.exports = router;
