const express = require('express');
const {
  createFaculty,
  getAllFaculties,
  getFacultyById,
  getFacultyByName,
  updateFaculty,
  deleteFaculty,
  getFacultyWithDepartments,
  seedFaculties
} = require('../controller/faculty.controller');

const router = express.Router();

// POST /api/faculties/seed - Seed initial faculties (for setup)
router.post('/seed', seedFaculties);

// POST /api/faculties - Create a new faculty
router.post('/', createFaculty);

// GET /api/faculties - Get all faculties
router.get('/', getAllFaculties);

// GET /api/faculties/:facultyId/departments - Get faculty with its departments
// IMPORTANT: This must be BEFORE /:facultyId to avoid route conflicts
router.get('/:facultyId/departments', getFacultyWithDepartments);

// GET /api/faculties/name/:name - Get faculty by name
router.get('/name/:name', getFacultyByName);

// GET /api/faculties/:facultyId - Get faculty by ID
router.get('/:facultyId', getFacultyById);

// PUT /api/faculties/:facultyId - Update faculty
router.put('/:facultyId', updateFaculty);

// DELETE /api/faculties/:facultyId - Delete faculty
router.delete('/:facultyId', deleteFaculty);

module.exports = router;
