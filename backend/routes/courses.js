const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Course = require('../models/Course');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('category').optional().isIn(['Soft Skills', 'Technical Skills', 'Analytical Skills']),
  query('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced']),
  query('search').optional().trim(),
  query('sort').optional().isIn(['newest', 'oldest', 'popular', 'rating', 'price_low', 'price_high'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    let filter = { isPublished: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.level) {
      filter.level = req.query.level;
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Build sort object
    let sort = {};
    switch (req.query.sort) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'popular':
        sort = { enrollmentCount: -1 };
        break;
      case 'rating':
        sort = { 'rating.average': -1 };
        break;
      case 'price_low':
        sort = { price: 1 };
        break;
      case 'price_high':
        sort = { price: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const courses = await Course.find(filter)
      .populate('createdBy', 'firstName lastName username')
      .select('-modules.lessons.content.textContent') // Exclude full text content for performance
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalCourses = await Course.countDocuments(filter);
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
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'firstName lastName username avatar')
      .populate('reviews.userId', 'firstName lastName username avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Admin only)
router.post('/', auth, isAdmin, [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('fullDescription')
    .trim()
    .notEmpty()
    .withMessage('Full description is required'),
  body('category')
    .isIn(['Soft Skills', 'Technical Skills', 'Analytical Skills'])
    .withMessage('Invalid category'),
  body('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced'])
    .withMessage('Invalid level'),
  body('price')
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('thumbnail')
    .isURL()
    .withMessage('Thumbnail must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const courseData = {
      ...req.body,
      createdBy: req.user.id,
      isFree: req.body.price === 0,
      isPremium: req.body.price > 0
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });

  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Update course with new data
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        course[key] = req.body[key];
      }
    });

    // Update pricing flags
    course.isFree = course.price === 0;
    course.isPremium = course.price > 0;

    await course.save();

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });

  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (Admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/courses/:id/review
// @desc    Add course review
// @access  Private
router.post('/:id/review', auth, [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { rating, comment } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user already reviewed this course
    const existingReview = course.reviews.find(
      review => review.userId.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this course'
      });
    }

    // Add review
    course.reviews.push({
      userId: req.user.id,
      rating,
      comment
    });

    // Recalculate rating
    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    course.rating = {
      average: totalRating / course.reviews.length,
      count: course.reviews.length
    };

    await course.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: course.rating
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/courses/category/:category
// @desc    Get courses by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    if (!['Soft Skills', 'Technical Skills', 'Analytical Skills'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const courses = await Course.find({ 
      category, 
      isPublished: true 
    })
    .populate('createdBy', 'firstName lastName')
    .select('-modules.lessons.content.textContent')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses
    });

  } catch (error) {
    console.error('Get courses by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;