const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid, user not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in admin middleware'
    });
  }
};

// Middleware to check if user is student or admin
const isStudent = async (req, res, next) => {
  try {
    if (req.user && (req.user.role === 'student' || req.user.role === 'admin')) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Access denied. Student access required.'
      });
    }
  } catch (error) {
    console.error('Student middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in student middleware'
    });
  }
};

module.exports = { auth, isAdmin, isStudent };