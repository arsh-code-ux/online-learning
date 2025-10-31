const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Assessment = require('../models/Assessment');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin privileges
router.use(auth, isAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get various statistics
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      recentUsers,
      popularCourses,
      recentPayments
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments(),
      User.aggregate([
        { $unwind: '$enrolledCourses' },
        { $count: 'totalEnrollments' }
      ]),
      Payment.aggregate([
        { $match: { status: 'succeeded' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      User.find({ role: 'student' })
        .select('firstName lastName email createdAt lastLogin')
        .sort({ createdAt: -1 })
        .limit(5),
      Course.find()
        .select('title category enrollmentCount rating')
        .sort({ enrollmentCount: -1 })
        .limit(5),
      Payment.find({ status: 'succeeded' })
        .populate('userId', 'firstName lastName email')
        .populate('courseId', 'title')
        .select('amount createdAt')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    const stats = {
      totalUsers,
      totalCourses,
      totalEnrollments: totalEnrollments[0]?.totalEnrollments || 0,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentUsers,
      popularCourses,
      recentPayments
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const searchQuery = req.query.search || '';
    const roleFilter = req.query.role || '';

    // Build filter
    let filter = {};
    if (searchQuery) {
      filter.$or = [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { username: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    if (roleFilter) {
      filter.role = roleFilter;
    }

    const [users, totalUsers] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/user/:id
// @desc    Get user details
// @access  Private (Admin only)
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('enrolledCourses.courseId', 'title category thumbnail')
      .populate('certificates.courseId', 'title')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's payments
    const payments = await Payment.find({ userId: req.params.id })
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        user,
        payments
      }
    });

  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/user/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin only)
router.put('/user/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/courses
// @desc    Get all courses for admin
// @access  Private (Admin only)
router.get('/courses', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const courses = await Course.find()
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCourses = await Course.countDocuments();
    const totalPages = Math.ceil(totalCourses / limit);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get admin courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/course/:id/publish
// @desc    Publish/unpublish course
// @access  Private (Admin only)
router.put('/course/:id/publish', async (req, res) => {
  try {
    const { isPublished } = req.body;
    
    const updateData = { isPublished };
    if (isPublished && !req.body.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: `Course ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: course
    });

  } catch (error) {
    console.error('Update course publish status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/payments
// @desc    Get all payments
// @access  Private (Admin only)
router.get('/payments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const payments = await Payment.find()
      .populate('userId', 'firstName lastName email')
      .populate('courseId', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPayments = await Payment.countDocuments();
    const totalPages = Math.ceil(totalPayments / limit);

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          currentPage: page,
          totalPages,
          totalPayments,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get analytics data
// @access  Private (Admin only)
router.get('/analytics', async (req, res) => {
  try {
    // Get enrollment trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      enrollmentTrends,
      courseCategoryStats,
      revenueTrends,
      userGrowth
    ] = await Promise.all([
      User.aggregate([
        { $unwind: '$enrolledCourses' },
        { $match: { 'enrolledCourses.enrolledAt': { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$enrolledCourses.enrolledAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Course.aggregate([
        {
          $group: {
            _id: '$category',
            courseCount: { $sum: 1 },
            totalEnrollments: { $sum: '$enrollmentCount' },
            avgRating: { $avg: '$rating.average' }
          }
        }
      ]),
      Payment.aggregate([
        { $match: { status: 'succeeded', createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            newUsers: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        enrollmentTrends,
        courseCategoryStats,
        revenueTrends,
        userGrowth
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;