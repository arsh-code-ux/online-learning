const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const { auth, isStudent } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/enrollment/enroll/:courseId
// @desc    Enroll in a course (for free courses)
// @access  Private
router.post('/enroll/:courseId', auth, isStudent, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course is free
    if (!course.isFree) {
      return res.status(400).json({
        success: false,
        message: 'This course requires payment. Please use the payment endpoint.'
      });
    }

    // Get user
    const user = await User.findById(userId);

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add enrollment
    user.enrolledCourses.push({
      courseId,
      enrolledAt: new Date(),
      progress: 0,
      completed: false
    });

    await user.save();

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        courseId,
        enrolledAt: new Date()
      }
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/enrollment/my-courses
// @desc    Get user's enrolled courses
// @access  Private
router.get('/my-courses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses.courseId',
        select: 'title description category thumbnail price level duration rating instructor'
      });

    const enrolledCourses = user.enrolledCourses.map(enrollment => ({
      ...enrollment.toObject(),
      course: enrollment.courseId
    }));

    res.json({
      success: true,
      data: enrolledCourses
    });

  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/enrollment/progress/:courseId
// @desc    Update course progress
// @access  Private
router.put('/progress/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress, completed = false } = req.body;

    // Validate progress
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be a number between 0 and 100'
      });
    }

    const user = await User.findById(req.user.id);

    // Find enrollment
    const enrollment = user.enrolledCourses.find(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Update progress
    enrollment.progress = progress;
    enrollment.completed = completed || progress === 100;
    
    if (enrollment.completed && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }

    await user.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: {
        progress: enrollment.progress,
        completed: enrollment.completed,
        completedAt: enrollment.completedAt
      }
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/enrollment/check/:courseId
// @desc    Check if user is enrolled in course
// @access  Private
router.get('/check/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user.id);

    const enrollment = user.enrolledCourses.find(
      enrollment => enrollment.courseId.toString() === courseId
    );

    res.json({
      success: true,
      data: {
        isEnrolled: !!enrollment,
        enrollment: enrollment || null
      }
    });

  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/enrollment/unenroll/:courseId
// @desc    Unenroll from a course
// @access  Private
router.delete('/unenroll/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;
    const user = await User.findById(req.user.id);

    // Find and remove enrollment
    const enrollmentIndex = user.enrolledCourses.findIndex(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (enrollmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    user.enrolledCourses.splice(enrollmentIndex, 1);
    await user.save();

    // Update course enrollment count
    const course = await Course.findById(courseId);
    if (course && course.enrollmentCount > 0) {
      course.enrollmentCount -= 1;
      await course.save();
    }

    res.json({
      success: true,
      message: 'Successfully unenrolled from course'
    });

  } catch (error) {
    console.error('Unenrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;