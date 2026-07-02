// controllers/authController.js
// This file handles all authentication logic:
// - Register a new user
// - Login an existing user
// - Get the currently logged in user
//
// Controllers receive the request, do the work,
// and send back a response.
// They should NOT contain route definitions.

const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');

// ==================== REGISTER ====================
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (no login required)

const register = async (req, res) => {
  try {
    // Extract fields from request body
    const { name, email, password } = req.body;

    // --- Validation ---
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create new user
    // Password hashing happens automatically in the pre-save hook
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT token for the new user
    const token = generateToken(user._id);

    // Send response
    // We send back user details + token
    // Frontend will store the token and use it for future requests
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
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
    console.error('Register Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// ==================== LOGIN ====================
// @desc    Login user and return JWT token
// @route   POST /api/auth/login
// @access  Public

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Validation ---
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    // We use .select('+password') because password has select: false
    // in the schema — it's not returned by default
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if entered password matches stored hash
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login date and streak
    const today = new Date().toDateString();
    const lastLogin = user.lastLoginDate
      ? new Date(user.lastLoginDate).toDateString()
      : null;

    if (lastLogin !== today) {
      // Check if last login was yesterday — maintain streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastLogin === yesterday.toDateString()) {
        user.currentStreak += 1;
      } else if (lastLogin !== today) {
        // Streak broken — reset to 1
        user.currentStreak = 1;
      }

      user.lastLoginDate = new Date();
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
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
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// ==================== GET ME ====================
// @desc    Get currently logged in user's details
// @route   GET /api/auth/me
// @access  Private (requires JWT token)

const getMe = async (req, res) => {
  try {
    // req.user is set by the authMiddleware after verifying the token
    // We fetch fresh data from database to get latest info
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

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
      }
    });

  } catch (error) {
    console.log("Register Error:",error.message);
    console.error('Full Error:', error);
    res.status(500).json({
      success: false,
      message: 'error.message'
    });
  }
};

module.exports = { register, login, getMe };