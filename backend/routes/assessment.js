const express = require('express');
const { body, validationResult } = require('express-validator');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const Course = require('../models/Course');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/assessment/course/:courseId
// @desc    Get assessments for a course
// @access  Private
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if user is enrolled in the course
    const user = await User.findById(req.user.id);
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (!isEnrolled && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access assessments'
      });
    }

    const assessments = await Assessment.find({ 
      courseId, 
      isActive: true 
    }).select('-questions.options.isCorrect -questions.correctAnswer');

    res.json({
      success: true,
      data: assessments
    });

  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/assessment/:id
// @desc    Get assessment by ID (without answers)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('courseId', 'title category')
      .select('-questions.options.isCorrect -questions.correctAnswer');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check if user is enrolled in the course
    const user = await User.findById(req.user.id);
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === assessment.courseId._id.toString()
    );

    if (!isEnrolled && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to access this assessment'
      });
    }

    res.json({
      success: true,
      data: assessment
    });

  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/assessment/submit/:id
// @desc    Submit assessment answers
// @access  Private
router.post('/submit/:id', auth, [
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers array is required'),
  body('answers.*.questionId')
    .notEmpty()
    .withMessage('Question ID is required for each answer'),
  body('answers.*.answer')
    .notEmpty()
    .withMessage('Answer is required for each question')
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

    const { id: assessmentId } = req.params;
    const { answers } = req.body;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Check if user is enrolled in the course
    const user = await User.findById(req.user.id);
    const isEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === assessment.courseId.toString()
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to submit this assessment'
      });
    }

    // Check if user has already passed this assessment
    const existingResult = user.assessmentResults.find(
      result => result.assessmentId.toString() === assessmentId && result.passed
    );

    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'You have already passed this assessment'
      });
    }

    // Check attempt limits
    const attemptCount = user.assessmentResults.filter(
      result => result.assessmentId.toString() === assessmentId
    ).length;

    if (attemptCount >= assessment.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: `Maximum attempts (${assessment.maxAttempts}) reached for this assessment`
      });
    }

    // Calculate score
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    const detailedResults = assessment.questions.map(question => {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      totalPoints += question.points;

      if (!userAnswer) {
        return {
          questionId: question._id,
          questionText: question.questionText,
          userAnswer: null,
          isCorrect: false,
          points: 0,
          maxPoints: question.points
        };
      }

      let isCorrect = false;

      if (question.questionType === 'multiple_choice') {
        const selectedOption = question.options.find(opt => opt._id.toString() === userAnswer.answer);
        isCorrect = selectedOption ? selectedOption.isCorrect : false;
      } else if (question.questionType === 'true_false') {
        isCorrect = userAnswer.answer.toLowerCase() === question.correctAnswer.toLowerCase();
      } else if (question.questionType === 'short_answer') {
        // Simple string comparison (case-insensitive)
        isCorrect = userAnswer.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      }

      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }

      return {
        questionId: question._id,
        questionText: question.questionText,
        userAnswer: userAnswer.answer,
        correctAnswer: question.correctAnswer || question.options.find(opt => opt.isCorrect)?.text,
        isCorrect,
        points: isCorrect ? question.points : 0,
        maxPoints: question.points,
        explanation: question.explanation
      };
    });

    const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = scorePercentage >= assessment.passingScore;

    // Save assessment result
    user.assessmentResults.push({
      assessmentId,
      score: scorePercentage,
      passed,
      completedAt: new Date()
    });

    await user.save();

    res.json({
      success: true,
      message: passed ? 'Assessment completed successfully!' : 'Assessment completed, but passing score not reached.',
      data: {
        score: scorePercentage,
        passed,
        passingScore: assessment.passingScore,
        correctAnswers,
        totalQuestions: assessment.questions.length,
        earnedPoints,
        totalPoints,
        attemptNumber: attemptCount + 1,
        maxAttempts: assessment.maxAttempts,
        detailedResults,
        canRetake: !passed && (attemptCount + 1) < assessment.maxAttempts
      }
    });

  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/assessment/results/:assessmentId
// @desc    Get user's assessment results
// @access  Private
router.get('/results/:assessmentId', auth, async (req, res) => {
  try {
    const { assessmentId } = req.params;
    
    const user = await User.findById(req.user.id);
    const results = user.assessmentResults.filter(
      result => result.assessmentId.toString() === assessmentId
    );

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No results found for this assessment'
      });
    }

    // Get assessment details
    const assessment = await Assessment.findById(assessmentId)
      .select('title passingScore maxAttempts');

    res.json({
      success: true,
      data: {
        assessment,
        results: results.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)),
        bestScore: Math.max(...results.map(r => r.score)),
        attemptCount: results.length
      }
    });

  } catch (error) {
    console.error('Get assessment results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/assessment/create
// @desc    Create new assessment (Admin only)
// @access  Private (Admin)
router.post('/create', auth, isAdmin, [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('courseId')
    .isMongoId()
    .withMessage('Valid course ID is required'),
  body('timeLimit')
    .isInt({ min: 5, max: 180 })
    .withMessage('Time limit must be between 5 and 180 minutes'),
  body('passingScore')
    .isInt({ min: 0, max: 100 })
    .withMessage('Passing score must be between 0 and 100'),
  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required')
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

    // Check if course exists
    const course = await Course.findById(req.body.courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const assessment = new Assessment({
      ...req.body,
      createdBy: req.user.id
    });

    await assessment.save();

    res.status(201).json({
      success: true,
      message: 'Assessment created successfully',
      data: assessment
    });

  } catch (error) {
    console.error('Create assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;