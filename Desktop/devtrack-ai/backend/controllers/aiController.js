// controllers/aiController.js
// Handles all AI insight requests.
// Collects user data from database,
// passes it to geminiService,
// and returns the AI response.

const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const {
  generateTaskSuggestions,
  generateProductivityAdvice,
  generateProjectHealth,
  generateWeeklySummary,
  generateSkillSuggestions
} = require('../services/geminiService');

// ==================== TASK SUGGESTIONS ====================
// @route  POST /api/ai/task-suggestions
// @access Private

const getTaskSuggestions = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    // Get project details
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get completed tasks for this project
    const completedTasks = await Task.find({
      project: projectId,
      status: 'Completed'
    }).select('title');

    const completedTitles = completedTasks.map(t => t.title);

    // Generate AI suggestions
    const suggestions = await generateTaskSuggestions(
      project.title,
      completedTitles
    );

    res.status(200).json({
      success: true,
      projectTitle: project.title,
      suggestions
    });

  } catch (error) {
    console.error('AI Task Suggestions Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate task suggestions'
    });
  }
};

// ==================== PRODUCTIVITY ADVICE ====================
// @route  GET /api/ai/productivity
// @access Private

const getProductivityAdvice = async (req, res) => {
  try {
    // Collect stats from database
    const user = await User.findById(req.user.id);
    const totalProjects = await Project.countDocuments({
      owner: req.user.id
    });
    const completedProjects = await Project.countDocuments({
      owner: req.user.id,
      status: 'Completed'
    });
    const totalTasks = await Task.countDocuments({ owner: req.user.id });
    const completedTasks = await Task.countDocuments({
      owner: req.user.id,
      status: 'Completed'
    });
    const pendingTasks = await Task.countDocuments({
      owner: req.user.id,
      status: 'Pending'
    });
    const inProgressTasks = await Task.countDocuments({
      owner: req.user.id,
      status: 'In Progress'
    });

    const stats = {
      totalProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      currentStreak: user.currentStreak
    };

    const advice = await generateProductivityAdvice(stats);

    // Update user's productivity score
    if (advice.overallScore) {
      await User.findByIdAndUpdate(req.user.id, {
        productivityScore: advice.overallScore
      });
    }

    res.status(200).json({
      success: true,
      stats,
      advice
    });

  } catch (error) {
    console.error('Productivity Advice Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate productivity advice'
    });
  }
};

// ==================== PROJECT HEALTH ====================
// @route  GET /api/ai/project-health
// @access Private

const getProjectHealth = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });

    if (projects.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Create some projects first to get health analysis'
      });
    }

    // Add task counts to each project
    const projectsWithStats = await Promise.all(
      projects.map(async (p) => {
        const totalTasks = await Task.countDocuments({ project: p._id });
        const completedTasks = await Task.countDocuments({
          project: p._id,
          status: 'Completed'
        });
        return {
          ...p.toObject(),
          totalTasks,
          completedTasks,
          progress: totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0
        };
      })
    );

    const health = await generateProjectHealth(projectsWithStats);

    res.status(200).json({
      success: true,
      health
    });

  } catch (error) {
    console.error('Project Health Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate project health analysis'
    });
  }
};

// ==================== WEEKLY SUMMARY ====================
// @route  GET /api/ai/weekly-summary
// @access Private

const getWeeklySummary = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const totalProjects = await Project.countDocuments({
      owner: req.user.id
    });
    const completedTasks = await Task.countDocuments({
      owner: req.user.id,
      status: 'Completed'
    });
    const pendingTasks = await Task.countDocuments({
      owner: req.user.id,
      status: 'Pending'
    });

    const data = {
      totalProjects,
      completedTasks,
      pendingTasks,
      currentStreak: user.currentStreak,
      languages: user.githubUsername ? 'Connected' : 'Not connected'
    };

    const summary = await generateWeeklySummary(data);

    res.status(200).json({
      success: true,
      summary
    });

  } catch (error) {
    console.error('Weekly Summary Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate weekly summary'
    });
  }
};

// ==================== SKILL SUGGESTIONS ====================
// @route  POST /api/ai/skills
// @access Private

const getSkillSuggestions = async (req, res) => {
  try {
    const { languages, projectTitles } = req.body;

    const suggestions = await generateSkillSuggestions(
      languages || [],
      projectTitles || []
    );

    res.status(200).json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Skill Suggestions Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to generate skill suggestions'
    });
  }
};

module.exports = {
  getTaskSuggestions,
  getProductivityAdvice,
  getProjectHealth,
  getWeeklySummary,
  getSkillSuggestions
};