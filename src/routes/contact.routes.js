const express = require('express');
const router = express.Router();
const { createContact, getAllContacts } = require('../controller/contact.controller.js');

// POST /api/contact - Create a new contact message
router.post('/', createContact);

// GET /api/contact - Get all contacts (admin access recommended)
router.get('/', getAllContacts);

module.exports = router;
