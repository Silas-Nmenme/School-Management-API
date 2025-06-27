const express = require('express');
const router = express.Router();
const {  addStudent, editStudent, deleteStudent, getAllStudents } = require('../controller/admins.controller.js');
const {isAuthenticated} = require('../middlewares/isAuth.js');

// Call point route
router.post('/add-student', isAuthenticated, addStudent);
router.put('/edit-student/:id', isAuthenticated, editStudent);
router.delete('/delete-student/:id', isAuthenticated, deleteStudent);
router.get('/get-all-students', isAuthenticated, getAllStudents);

module.exports = router;