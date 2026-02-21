const express = require('express');
const { submitApplication, getApplicationStatus, getApplicationDetails, getAllApplications, getApplicationByEmail } = require('../controller/applications.controller');

const router = express.Router();

// POST /api/applications - Submit a new university application
router.post('/', submitApplication);

// GET /api/applications/email/:email - Get application by email (specific route - must come before generic ID routes)
router.get('/email/:email', getApplicationByEmail);

// GET /api/applications/:applicationId/status - Get application status
router.get('/:applicationId/status', getApplicationStatus);

// GET /api/applications/:applicationId - Get full application details
router.get('/:applicationId', getApplicationDetails);

// GET /api/applications - Get all applications (with pagination and filters) - must come last to avoid conflicts
router.get('/', getAllApplications);

module.exports = router;
