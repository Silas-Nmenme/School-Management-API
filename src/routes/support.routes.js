const express = require('express');
const { submitSupportRequest } = require('../controller/students.controller.js');
const { isAuthenticated } = require('../middlewares/isAuth.js');
const router = express.Router();

// POST /api/support/request - Submit support request
router.post('/request', isAuthenticated, submitSupportRequest);

module.exports = router;
