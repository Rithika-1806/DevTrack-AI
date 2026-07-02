// controllers/userController.js
// Handles user profile operations:
// - Get full profile with stats
// - Update profile (name, github username)
// - Update password

const User = require('../models/userModel');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');

// ==================== GET PROFILE ====================
// @route  GET /api/users/profile
// @access Private

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's stats from database
    const totalProjects = await Project.countDocuments({
      owner: req.user.id
    });
    const completedProjects = await Project.countDocuments({
      owner: req.user.id,
      status: 'Completed'
    });
    const totalTasks = await Task.countDocuments({
      owner: req.user.id
    });
    const completedTasks = await Task.countDocuments({
      owner: req.user.id,
      status: 'Completed'
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
        profilePicture: user.profilePicture,
        currentStreak: user.currentStreak,
        productivityScore: user.productivityScore,
        createdAt: user.createdAt
      },
      stats: {
        totalProjects,
        completedProjects,
        totalTasks,
        completedTasks,
        completionRate: totalTasks > 0
          ? Math.round((completedTasks / totalTasks) * 100)
          : 0
      }
    });

  } catch (error) {
    console.error('Get Profile Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== UPDATE PROFILE ====================
// @route  PUT /api/users/profile
// @access Private

const updateProfile = async (req, res) => {
  try {
    const { name, githubUsername } = req.body;

    // Build update object — only update provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (githubUsername !== undefined) {
      updateFields.githubUsername = githubUsername;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        githubUsername: user.githubUsername,
        profilePicture: user.profilePicture,
        currentStreak: user.currentStreak,
        productivityScore: user.productivityScore
      }
    });

  } catch (error) {
    console.error('Update Profile Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ==================== UPDATE PASSWORD ====================
// @route  PUT /api/users/password
// @access Private

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Get user with password field
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password — pre-save hook will hash it
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Update Password Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getProfile, updateProfile, updatePassword };