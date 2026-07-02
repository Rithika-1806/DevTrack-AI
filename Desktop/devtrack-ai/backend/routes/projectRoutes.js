// routes/projectRoutes.js
// Maps URLs to controller functions.
// All routes here are protected — user must be logged in.

const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// All routes protected by JWT middleware
router.use(protect);

router.route('/')
  .get(getProjects)       // GET  /api/projects
  .post(createProject);   // POST /api/projects

router.route('/:id')
  .get(getProject)        // GET    /api/projects/:id
  .put(updateProject)     // PUT    /api/projects/:id
  .delete(deleteProject); // DELETE /api/projects/:id

module.exports = router;