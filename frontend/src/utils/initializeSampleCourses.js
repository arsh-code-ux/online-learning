// Initialize sample courses with modules for demonstration
export const initializeSampleCourses = () => {
  const sampleCourses = [
    {
      id: 'course-1',
      title: 'Complete Web Development Bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js and MongoDB from scratch. Build real-world projects and become a full-stack developer.',
      category: 'technical-skills',
      level: 'beginner',
      price: 0,
      isPremium: false,
      instructor: 'John Doe',
      duration: '12 weeks',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      rating: 4.8,
      students: 15000,
      createdAt: new Date().toISOString(),
      modules: [
        {
          id: 'module-1',
          moduleNumber: 1,
          title: 'Introduction to Web Development',
          description: 'Get started with the basics of web development',
          videos: [
            {
              id: 'video-1',
              title: 'What is Web Development?',
              url: 'https://www.youtube.com/watch?v=EceJQ8JZPbE',
              duration: '15:30',
              summary: 'Introduction to web development, frontend vs backend, and career paths'
            },
            {
              id: 'video-2',
              title: 'Setting up Development Environment',
              url: 'https://www.youtube.com/watch?v=mJiWqvvZayc',
              duration: '20:45',
              summary: 'Learn how to install VS Code, Node.js, and essential extensions'
            }
          ]
        },
        {
          id: 'module-2',
          moduleNumber: 2,
          title: 'HTML Fundamentals',
          description: 'Master HTML tags, elements, and structure',
          videos: [
            {
              id: 'video-3',
              title: 'HTML Basics',
              url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
              duration: '25:00',
              summary: 'Learn HTML structure, tags, and basic elements'
            },
            {
              id: 'video-4',
              title: 'HTML Forms and Inputs',
              url: 'https://www.youtube.com/watch?v=fNcJuPIZ2WE',
              duration: '30:15',
              summary: 'Create interactive forms with various input types'
            }
          ]
        }
      ]
    },
    {
      id: 'course-2',
      title: 'JavaScript Mastery Course',
      description: 'Master JavaScript from beginner to advanced. Learn ES6+, async programming, DOM manipulation, and modern JavaScript practices.',
      category: 'technical-skills',
      level: 'intermediate',
      price: 999,
      isPremium: true,
      instructor: 'Sarah Williams',
      duration: '8 weeks',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
      rating: 4.9,
      students: 12000,
      createdAt: new Date().toISOString(),
      modules: [
        {
          id: 'module-1',
          moduleNumber: 1,
          title: 'JavaScript Fundamentals',
          description: 'Core concepts of JavaScript programming',
          videos: [
            {
              id: 'video-1',
              title: 'Variables and Data Types',
              url: 'https://www.youtube.com/watch?v=9emXNzqCKyg',
              duration: '18:30',
              summary: 'Understanding variables, const, let, and JavaScript data types'
            },
            {
              id: 'video-2',
              title: 'Functions and Scope',
              url: 'https://www.youtube.com/watch?v=gigtS_5KOqo',
              duration: '22:45',
              summary: 'Learn about functions, arrow functions, and scope in JavaScript'
            }
          ]
        },
        {
          id: 'module-2',
          moduleNumber: 2,
          title: 'ES6+ Features',
          description: 'Modern JavaScript features and syntax',
          videos: [
            {
              id: 'video-3',
              title: 'Destructuring and Spread Operator',
              url: 'https://www.youtube.com/watch?v=NIq3qLaHCIs',
              duration: '16:20',
              summary: 'Master destructuring, spread, and rest operators'
            }
          ]
        }
      ]
    },
    {
      id: 'course-3',
      title: 'Communication Skills Masterclass',
      description: 'Improve your communication skills, public speaking, and presentation abilities. Perfect for career growth and personal development.',
      category: 'soft-skills',
      level: 'beginner',
      price: 0,
      isPremium: false,
      instructor: 'Michael Brown',
      duration: '6 weeks',
      thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
      rating: 4.7,
      students: 8500,
      createdAt: new Date().toISOString(),
      modules: [
        {
          id: 'module-1',
          moduleNumber: 1,
          title: 'Effective Communication Basics',
          description: 'Foundation of clear and impactful communication',
          videos: [
            {
              id: 'video-1',
              title: 'What Makes Good Communication?',
              url: 'https://www.youtube.com/watch?v=eIho2S0ZahI',
              duration: '14:30',
              summary: 'Understanding the principles of effective communication'
            },
            {
              id: 'video-2',
              title: 'Active Listening Skills',
              url: 'https://www.youtube.com/watch?v=7wUCyjiyXdg',
              duration: '19:15',
              summary: 'Learn how to listen actively and respond appropriately'
            }
          ]
        }
      ]
    },
    {
      id: 'course-4',
      title: 'Data Analysis with Python',
      description: 'Learn data analysis using Python, pandas, numpy, and visualization libraries. Work with real datasets and build analytical projects.',
      category: 'analytical-skills',
      level: 'intermediate',
      price: 0,
      isPremium: false,
      instructor: 'Dr. Emily Chen',
      duration: '10 weeks',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      rating: 4.8,
      students: 10000,
      createdAt: new Date().toISOString(),
      modules: [
        {
          id: 'module-1',
          moduleNumber: 1,
          title: 'Python for Data Analysis',
          description: 'Getting started with Python and data analysis libraries',
          videos: [
            {
              id: 'video-1',
              title: 'Introduction to Pandas',
              url: 'https://www.youtube.com/watch?v=vmEHCJofslg',
              duration: '25:00',
              summary: 'Learn the basics of pandas library for data manipulation'
            },
            {
              id: 'video-2',
              title: 'Data Visualization with Matplotlib',
              url: 'https://www.youtube.com/watch?v=0P7QnIQDBJY',
              duration: '28:30',
              summary: 'Create stunning visualizations with matplotlib'
            }
          ]
        },
        {
          id: 'module-2',
          moduleNumber: 2,
          title: 'Advanced Data Analysis',
          description: 'Deep dive into data cleaning and analysis',
          videos: [
            {
              id: 'video-3',
              title: 'Data Cleaning Techniques',
              url: 'https://www.youtube.com/watch?v=iYie42M1ZyU',
              duration: '22:45',
              summary: 'Handle missing data, outliers, and data transformation'
            }
          ]
        }
      ]
    }
  ];

  // Get existing admin courses
  const existingCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
  
  // Only add sample courses if there are no existing courses
  if (existingCourses.length === 0) {
    localStorage.setItem('adminCourses', JSON.stringify(sampleCourses));
    console.log('✅ Sample courses initialized successfully!');
    return sampleCourses;
  }
  
  console.log('ℹ️ Courses already exist in localStorage');
  return existingCourses;
};

// Call this function when app loads
if (typeof window !== 'undefined') {
  // Check if courses need initialization
  const courses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
  if (courses.length === 0) {
    console.log('🚀 Initializing sample courses...');
    initializeSampleCourses();
  }
}
