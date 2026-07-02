// routes/aiRoutes.js

const express = require('express');
const router = express.Router();
const {
  getTaskSuggestions,
  getProductivityAdvice,
  getProjectHealth,
  getWeeklySummary,
  getSkillSuggestions
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// All AI routes are protected
router.use(protect);

router.post('/task-suggestions', getTaskSuggestions);
router.get('/productivity', getProductivityAdvice);
router.get('/project-health', getProjectHealth);
router.get('/weekly-summary', getWeeklySummary);
router.post('/skills', getSkillSuggestions);

module.exports = router;