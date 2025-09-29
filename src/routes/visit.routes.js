const express = require('express');
const router = express.Router();
const {
    createVisit,
    getAllVisits,
    getVisitById,
    updateVisitStatus,
    deleteVisit,
    getVisitStats
} = require('../controller/visit.controller');

// Public routes
// POST /api/visits - Create a new visit request
router.post('/', createVisit);

// Admin routes (assuming you have admin middleware)
// GET /api/visits - Get all visit requests
router.get('/', getAllVisits);

// GET /api/visits/stats - Get visit statistics
router.get('/stats', getVisitStats);

// GET /api/visits/:id - Get visit by ID
router.get('/:id', getVisitById);

// PUT /api/visits/:id/status - Update visit status
router.put('/:id/status', updateVisitStatus);

// DELETE /api/visits/:id - Delete visit request
router.delete('/:id', deleteVisit);

module.exports = router;
