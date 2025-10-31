const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  fullDescription: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    enum: ['Soft Skills', 'Technical Skills', 'Analytical Skills']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration: {
    hours: {
      type: Number,
      required: true,
      min: 1
    },
    minutes: {
      type: Number,
      default: 0,
      min: 0,
      max: 59
    }
  },
  thumbnail: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  instructor: {
    name: {
      type: String,
      required: true
    },
    bio: String,
    avatar: String,
    expertise: [String]
  },
  modules: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    lessons: [{
      title: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['video', 'text', 'quiz', 'assignment'],
        required: true
      },
      content: {
        videoUrl: String,
        textContent: String,
        duration: Number, // in minutes
        resources: [{
          title: String,
          url: String,
          type: String // pdf, link, etc.
        }]
      },
      isFree: {
        type: Boolean,
        default: true
      },
      order: {
        type: Number,
        required: true
      }
    }],
    order: {
      type: Number,
      required: true
    }
  }],
  requirements: [String],
  learningOutcomes: [String],
  tags: [String],
  language: {
    type: String,
    default: 'English'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate total course duration
courseSchema.virtual('totalDuration').get(function() {
  let totalMinutes = 0;
  this.modules.forEach(module => {
    module.lessons.forEach(lesson => {
      if (lesson.content.duration) {
        totalMinutes += lesson.content.duration;
      }
    });
  });
  return {
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60
  };
});

// Calculate discount percentage
courseSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Index for search functionality
courseSchema.index({
  title: 'text',
  description: 'text',
  'instructor.name': 'text',
  tags: 'text'
});

courseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);