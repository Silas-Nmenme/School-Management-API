const express = require('express');
const { submitApplication, getApplicationStatus, getApplicationDetails, getAllApplications, getApplicationByEmail } = require('../controller/applications.controller');

const router = express.Router();

// POST /api/applications - Submit a new university application
router.post('/', submitApplication);

// GET /api/applications/email/:email - Get application by email (specific route - must come first to avoid conflicts)
router.get('/email/:email', getApplicationByEmail);

// GET /api/applications - Get all applications (with pagination and filters) - must come before /:applicationId routes
router.get('/', getAllApplications);

// GET /api/applications/:applicationId/status - Get application status
router.get('/:applicationId/status', getApplicationStatus);

// GET /api/applications/:applicationId - Get full application details (must come last)
router.get('/:applicationId', getApplicationDetails);

module.exports = router;
