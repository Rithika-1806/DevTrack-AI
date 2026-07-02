// routes/githubRoutes.js

const express = require('express');
const router = express.Router();
const { getGitHubData } = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');

// Protected — user must be logged in
// GET /api/github/:username
router.get('/:username', protect, getGitHubData);

module.exports = router;