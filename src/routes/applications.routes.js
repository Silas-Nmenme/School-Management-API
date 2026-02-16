const express = require('express');
const { submitApplication, getApplicationStatus, getApplicationDetails } = require('../controller/applications.controller');

const router = express.Router();

// POST /api/applications - Submit a new university application
router.post('/', submitApplication);

// GET /api/applications/:applicationId/status - Get application status (aligned with admin workflow)
router.get('/:applicationId/status', getApplicationStatus);

// GET /api/applications/:applicationId - Get full application details
router.get('/:applicationId', getApplicationDetails);

module.exports = router;
