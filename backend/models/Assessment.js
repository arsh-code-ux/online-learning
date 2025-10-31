const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  type: {
    type: String,
    enum: ['quiz', 'final_assessment', 'practice_test'],
    default: 'quiz'
  },
  timeLimit: {
    type: Number, // in minutes
    required: true,
    min: 5,
    max: 180
  },
  passingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 70
  },
  maxAttempts: {
    type: Number,
    default: 3,
    min: 1,
    max: 10
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: ['multiple_choice', 'true_false', 'short_answer'],
      default: 'multiple_choice'
    },
    options: [{
      text: String,
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    correctAnswer: String, // For short answer questions
    explanation: String,
    points: {
      type: Number,
      default: 1,
      min: 1
    },
    order: {
      type: Number,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate total points
assessmentSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

assessmentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Assessment', assessmentSchema);