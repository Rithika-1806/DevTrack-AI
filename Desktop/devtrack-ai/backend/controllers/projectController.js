// controllers/projectController.js
// Handles all project CRUD operations.
// Every function here:
// 1. Reads data from req.body or req.params
// 2. Performs database operation
// 3. Sends back a response
//
// IMPORTANT: We always filter by owner: req.user.id
// This ensures users can ONLY see and edit THEIR OWN projects.
// Without this filter, any logged-in user could
// read or delete another user's projects!

const Project = require('../models/projectModel');
const Task = require('../models/taskModel');

// ==================== CREATE PROJECT ====================
// @route  POST /api/projects
// @access Private

const createProject = async (req, res) => {
  try {
    const { title, description, deadline, priority, status, tags } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Project title is required'
      });
    }

    const project = await Project.create({
      title,
      description,
      deadline,
      priority,
      status,
      tags,
      owner: req.user.id   // From JWT token via authMiddleware
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Create Project Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== GET ALL PROJECTS ====================
// @route  GET /api/projects
// @access Private

const getProjects = async (req, res) => {
  try {
    // Find all projects belonging to logged in user
    // Sort by newest first
    const projects = await Project.find({ owner: req.user.id })
      .sort({ createdAt: -1 });

    // For each project, count its tasks
    // We use Promise.all to run all counts simultaneously
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({ project: project._id });
        const completedTasks = await Task.countDocuments({
          project: project._id,
          status: 'Completed'
        });

        // Calculate progress percentage
        const progress = totalTasks > 0
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0;

        return {
          ...project.toObject(),  // Convert Mongoose doc to plain object
          totalTasks,
          completedTasks,
          progress
        };
      })
    );

    res.status(200).json({
      success: true,
      count: projects.length,
      projects: projectsWithStats
    });

  } catch (error) {
    console.error('Get Projects Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== GET SINGLE PROJECT ====================
// @route  GET /api/projects/:id
// @access Private

const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Make sure the project belongs to the logged in user
    if (project.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this project'
      });
    }

    // Get task stats for this project
    const totalTasks = await Task.countDocuments({ project: project._id });
    const completedTasks = await Task.countDocuments({
      project: project._id,
      status: 'Completed'
    });
    const pendingTasks = await Task.countDocuments({
      project: project._id,
      status: 'Pending'
    });

    res.status(200).json({
      success: true,
      project: {
        ...project.toObject(),
        totalTasks,
        completedTasks,
        pendingTasks,
        progress: totalTasks > 0
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0
      }
    });

  } catch (error) {
    console.error('Get Project Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== UPDATE PROJECT ====================
// @route  PUT /api/projects/:id
// @access Private

const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Verify ownership
    if (project.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    // Update the project
    // { new: true } returns the updated document
    // { runValidators: true } runs schema validations on update
    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('Update Project Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== DELETE PROJECT ====================
// @route  DELETE /api/projects/:id
// @access Private

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Verify ownership
    if (project.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    // Also delete ALL tasks belonging to this project
    // If we don't do this, orphan tasks remain in the database
    await Task.deleteMany({ project: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Project and all its tasks deleted successfully'
    });

  } catch (error) {
    console.error('Delete Project Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
};