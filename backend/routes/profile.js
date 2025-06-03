const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const authenticate = require('../middleware/authenticate');

// Get user profile
router.get('/', authenticate, getProfile);

// Update user profile
router.put('/', authenticate, updateProfile);

module.exports = router;