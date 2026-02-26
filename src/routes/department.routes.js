const express = require('express');
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  getDepartmentByName,
  getDepartmentsByFaculty,
  getDepartmentCourses,
  updateDepartment,
  deleteDepartment,
  seedDepartments,
  searchDepartments
} = require('../controller/department.controller');

const router = express.Router();

// POST /api/departments/seed - Seed initial departments (for setup)
router.post('/seed', seedDepartments);

// POST /api/departments - Create a new department
router.post('/', createDepartment);

// GET /api/departments/search - Search departments
router.get('/search', searchDepartments);

// GET /api/departments/faculty/:facultyId - Get departments by faculty
// IMPORTANT: This must be BEFORE /:departmentId to avoid route conflicts
router.get('/faculty/:facultyId', getDepartmentsByFaculty);

// GET /api/departments/name/:name - Get department by name (with optional faculty filter)
router.get('/name/:name', getDepartmentByName);

// GET /api/departments/:departmentId/courses - Get courses for a department
// IMPORTANT: This must be BEFORE /:departmentId to avoid route conflicts
router.get('/:departmentId/courses', getDepartmentCourses);

// GET /api/departments - Get all departments (with optional faculty filter)
router.get('/', getAllDepartments);

// GET /api/departments/:departmentId - Get department by ID
router.get('/:departmentId', getDepartmentById);

// PUT /api/departments/:departmentId - Update department
router.put('/:departmentId', updateDepartment);

// DELETE /api/departments/:departmentId - Delete department
router.delete('/:departmentId', deleteDepartment);

module.exports = router;
