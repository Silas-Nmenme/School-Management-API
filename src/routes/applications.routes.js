const express = require('express');
const { submitApplication } = require('../controller/applications.controller');

const router = express.Router();

// POST /api/applications - Submit a new university application
router.post('/', submitApplication);

module.exports = router;
