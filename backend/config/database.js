const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // For development, use MongoDB Atlas or skip connection
    if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('localhost:27017')) {
      console.log('⚠️  Development mode: Using in-memory data storage');
      console.log('💡 For persistent data, set up MongoDB Atlas connection');
      // Create mock database functions for development
      global.mockDB = {
        users: [],
        courses: [
          {
            _id: '1',
            title: 'Communication Skills',
            description: 'Master effective communication techniques',
            category: 'Soft Skills',
            price: 99,
            duration: '4 weeks',
            level: 'Beginner',
            instructor: 'Dr. Sarah Johnson',
            rating: 4.8,
            studentsEnrolled: 1234,
            isPremium: false,
            image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500'
          },
          {
            _id: '2', 
            title: 'JavaScript Mastery',
            description: 'Complete JavaScript programming course',
            category: 'Technical Skills',
            price: 149,
            duration: '8 weeks',
            level: 'Intermediate', 
            instructor: 'John Smith',
            rating: 4.9,
            studentsEnrolled: 2156,
            isPremium: true,
            image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500'
          },
          {
            _id: '3',
            title: 'Data Analysis with Python',
            description: 'Learn data analysis and visualization',
            category: 'Analytical Skills',
            price: 199,
            duration: '10 weeks',
            level: 'Advanced',
            instructor: 'Dr. Emily Chen',
            rating: 4.7,
            studentsEnrolled: 987,
            isPremium: true,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500'
          }
        ],
        enrollments: []
      };
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;