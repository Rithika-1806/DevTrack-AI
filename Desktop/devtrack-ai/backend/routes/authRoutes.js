// routes/authRoutes.js
// This file maps HTTP methods + URLs to controller functions.
//
// Think of routes as a menu:
// "If someone orders POST /register → serve them the register function"

const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes — no token needed
router.post('/register', register);
router.post('/login', login);

// Private route — token required
// protect middleware runs first, then getMe
router.get('/me', protect, getMe);

module.exports = router;