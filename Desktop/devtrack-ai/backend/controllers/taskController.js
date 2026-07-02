// controllers/taskController.js
// Handles all task CRUD operations.
// Tasks always belong to a project.
// When a task is marked Completed, we record the date.

const Task = require('../models/taskModel');
const Project = require('../models/projectModel');

// ==================== CREATE TASK ====================
// @route  POST /api/tasks
// @access Private

const createTask = async (req, res) => {
  try {
    const {
      title, description, deadline,
      priority, status, estimatedHours, projectId
    } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({
        success: false,
        message: 'Task title and project ID are required'
      });
    }

    // Make sure the project exists and belongs to this user
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add tasks to this project'
      });
    }

    const task = await Task.create({
      title,
      description,
      deadline,
      priority,
      status: status || 'Pending',
      estimatedHours,
      project: projectId,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    });

  } catch (error) {
    console.error('Create Task Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== GET TASKS BY PROJECT ====================
// @route  GET /api/tasks/:projectId
// @access Private

const getTasksByProject = async (req, res) => {
  try {
    // Verify the project belongs to the user first
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (project.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error('Get Tasks Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== UPDATE TASK ====================
// @route  PUT /api/tasks/:id
// @access Private

const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // If task is being marked as Completed, record the date
    if (req.body.status === 'Completed' && task.status !== 'Completed') {
      req.body.completedDate = new Date();
    }

    // If task is being moved back from Completed, clear the date
    if (req.body.status !== 'Completed') {
      req.body.completedDate = null;
    }

    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task
    });

  } catch (error) {
    console.error('Update Task Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== DELETE TASK ====================
// @route  DELETE /api/tasks/:id
// @access Private

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete Task Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== GET ALL TASKS OF USER ====================
// @route  GET /api/tasks
// @access Private
// Used by dashboard to show overall task statistics

const getAllUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.id })
      .populate('project', 'title')  // Get project title along with task
      .sort({ createdAt: -1 });

    // Count stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks
      },
      tasks
    });

  } catch (error) {
    console.error('Get All Tasks Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  getAllUserTasks
};