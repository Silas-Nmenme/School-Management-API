const express = require('express');
const {  registerStudent, loginStudent, forgetPassword, verifyOtp, resetPassword, logoutStudent, getStudentCount } = require('../controller/students.controller.js');
const router = express.Router();



router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/forget-password', forgetPassword);
router.post('/verify-otp', verifyOtp);
router.put('/reset-password/:studentId', resetPassword);
router.post('/logout', logoutStudent);
router.get('/student-count', getStudentCount);



module.exports = router