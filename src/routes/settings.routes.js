const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controller/settings.controller.js');
const { isAuthenticated } = require('../middlewares/isAuth.js');

// Settings Routes
router.get('/', isAuthenticated, getSettings);
router.put('/', isAuthenticated, updateSettings);

module.exports = router;
