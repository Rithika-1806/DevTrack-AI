// middleware/authMiddleware.js
// This middleware protects private routes.
//
// How it works:
// 1. Client sends a request with a token in the header
//    like: Authorization: Bearer eyJhbGci...
// 2. This middleware extracts the token
// 3. Verifies it using our JWT_SECRET
// 4. If valid → attaches user info to req.user → passes to controller
// 5. If invalid → returns 401 Unauthorized immediately

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, deny access
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. No token provided.'
      });
    }

    // Verify the token using our secret key
    // If token is expired or tampered, this throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the ID stored in the token
    // Attach user to req so controllers can access it
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists'
      });
    }

    // Move to the next function (the controller)
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token is invalid or expired.'
    });
  }
};

module.exports = { protect };