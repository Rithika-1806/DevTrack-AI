// routes/taskRoutes.js

const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getAllUserTasks
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All routes protected
router.use(protect);

router.route('/')
  .get(getAllUserTasks)  // GET  /api/tasks  → all tasks of logged in user
  .post(createTask);    // POST /api/tasks  → create new task

router.route('/project/:projectId')
  .get(getTasksByProject); // GET /api/tasks/project/:projectId

router.route('/:id')
  .put(updateTask)      // PUT    /api/tasks/:id
  .delete(deleteTask);  // DELETE /api/tasks/:id

module.exports = router;