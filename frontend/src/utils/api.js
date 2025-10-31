import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data with detailed course content
const mockCourses = [
  {
    _id: '1',
    title: 'Effective Communication Skills',
    description: 'Master the art of communication in personal and professional settings. Learn verbal, non-verbal, and written communication techniques that will transform your interactions.',
    category: 'Soft Skills',
    price: 2499,
    originalPrice: 4999,
    duration: '6 weeks',
    level: 'Beginner',
    instructor: 'Dr. Sarah Johnson',
    instructorBio: 'Communication Expert with 15+ years experience, TEDx Speaker, Author of "The Communication Code"',
    rating: 4.8,
    studentsEnrolled: 12340,
    isPremium: false,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500',
    videoCount: 45,
    downloadableResources: 25,
    practiceExercises: 30,
    certificate: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'Foundation of Communication',
        lessons: ['Understanding Communication Basics', 'Types of Communication', 'Communication Barriers', 'Building Confidence'],
        duration: '2 hours'
      },
      {
        title: 'Verbal Communication Mastery',
        lessons: ['Voice Modulation', 'Speaking with Impact', 'Storytelling Techniques', 'Presentation Skills'],
        duration: '3 hours'
      },
      {
        title: 'Non-Verbal Communication',
        lessons: ['Body Language Secrets', 'Facial Expressions', 'Gestures & Posture', 'Personal Space'],
        duration: '2.5 hours'
      },
      {
        title: 'Written Communication Excellence',
        lessons: ['Email Etiquette', 'Professional Writing', 'Social Media Communication', 'Report Writing'],
        duration: '3.5 hours'
      },
      {
        title: 'Advanced Communication Strategies',
        lessons: ['Difficult Conversations', 'Conflict Resolution', 'Negotiation Skills', 'Cross-Cultural Communication'],
        duration: '4 hours'
      }
    ],
    learningOutcomes: [
      'Speak confidently in any situation',
      'Write professional emails and documents',
      'Master non-verbal communication',
      'Handle difficult conversations effectively',
      'Build stronger relationships'
    ],
    requirements: ['Basic understanding of English/Hindi', 'Willingness to practice', 'No prior experience needed'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    _id: '2',
    title: 'Complete JavaScript Mastery 2024',
    description: 'Learn JavaScript from absolute beginner to advanced developer. Master ES6+, Async/Await, DOM manipulation, APIs, and build real-world projects.',
    category: 'Technical Skills',
    price: 3999,
    originalPrice: 7999,
    duration: '12 weeks',
    level: 'Beginner to Advanced',
    instructor: 'Priya Sharma',
    instructorBio: 'Senior Full-Stack Developer at Google, 8+ years experience, JavaScript Expert, Course Creator',
    rating: 4.9,
    studentsEnrolled: 25670,
    isPremium: true,
    isPopular: true,
    isBestSeller: true,
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500',
    videoCount: 150,
    downloadableResources: 75,
    practiceExercises: 100,
    projects: 12,
    certificate: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'JavaScript Fundamentals',
        lessons: ['Variables & Data Types', 'Functions & Scope', 'Arrays & Objects', 'Control Structures'],
        duration: '8 hours'
      },
      {
        title: 'DOM Manipulation & Events',
        lessons: ['DOM Selection', 'Event Handling', 'Dynamic Content', 'Form Validation'],
        duration: '6 hours'
      },
      {
        title: 'ES6+ Modern JavaScript',
        lessons: ['Arrow Functions', 'Destructuring', 'Modules', 'Classes', 'Promises'],
        duration: '10 hours'
      },
      {
        title: 'Async JavaScript & APIs',
        lessons: ['Fetch API', 'Async/Await', 'Error Handling', 'JSON Processing'],
        duration: '8 hours'
      },
      {
        title: 'Real-World Projects',
        lessons: ['Weather App', 'Todo Application', 'E-commerce Cart', 'Portfolio Website'],
        duration: '15 hours'
      }
    ],
    learningOutcomes: [
      'Build dynamic web applications',
      'Master modern JavaScript (ES6+)',
      'Work with APIs and databases',
      'Create interactive user interfaces',
      'Land a JavaScript developer job'
    ],
    requirements: ['Basic computer knowledge', 'Any web browser', 'Text editor (provided recommendations)'],
    videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg'
  },
  {
    _id: '3',
    title: 'Data Science with Python Complete Course',
    description: 'Complete data science course covering Python, Pandas, NumPy, Matplotlib, Machine Learning, and real industry projects. Perfect for career transition.',
    category: 'Analytical Skills',
    price: 4999,
    originalPrice: 9999,
    duration: '16 weeks',
    level: 'Intermediate to Advanced',
    instructor: 'Dr. Rajesh Kumar',
    instructorBio: 'Data Scientist at Microsoft, PhD in Statistics, 12+ years experience, Published Author',
    rating: 4.7,
    studentsEnrolled: 18950,
    isPremium: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
    videoCount: 200,
    downloadableResources: 100,
    practiceExercises: 150,
    projects: 8,
    certificate: true,
    jobGuarantee: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'Python for Data Science',
        lessons: ['Python Basics', 'NumPy Arrays', 'Pandas DataFrames', 'Data Cleaning'],
        duration: '12 hours'
      },
      {
        title: 'Data Visualization',
        lessons: ['Matplotlib Basics', 'Seaborn Advanced', 'Plotly Interactive', 'Dashboard Creation'],
        duration: '10 hours'
      },
      {
        title: 'Statistical Analysis',
        lessons: ['Descriptive Statistics', 'Probability', 'Hypothesis Testing', 'Correlation Analysis'],
        duration: '15 hours'
      },
      {
        title: 'Machine Learning Fundamentals',
        lessons: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering'],
        duration: '20 hours'
      },
      {
        title: 'Industry Projects',
        lessons: ['Sales Forecasting', 'Customer Segmentation', 'Sentiment Analysis', 'Recommendation System'],
        duration: '25 hours'
      }
    ],
    learningOutcomes: [
      'Analyze complex datasets',
      'Build machine learning models',
      'Create interactive dashboards',
      'Make data-driven decisions',
      'Get hired as Data Scientist'
    ],
    requirements: ['Basic mathematics knowledge', 'Computer with internet', 'No programming experience needed'],
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw'
  },
  {
    _id: '4',
    title: 'Leadership Excellence Program',
    description: 'Transform into an inspiring leader. Learn team management, decision making, emotional intelligence, and strategic thinking from industry experts.',
    category: 'Soft Skills',
    price: 3499,
    originalPrice: 6999,
    duration: '8 weeks',
    level: 'Intermediate',
    instructor: 'Anita Singh',
    instructorBio: 'Executive Coach, Former VP at Infosys, Leadership Trainer for 500+ companies, Bestselling Author',
    rating: 4.6,
    studentsEnrolled: 8430,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
    videoCount: 60,
    downloadableResources: 40,
    practiceExercises: 50,
    certificate: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'Leadership Fundamentals',
        lessons: ['What Makes a Great Leader', 'Leadership Styles', 'Self-Assessment', 'Vision Setting'],
        duration: '4 hours'
      },
      {
        title: 'Team Management',
        lessons: ['Building High-Performance Teams', 'Delegation Skills', 'Motivation Techniques', 'Performance Management'],
        duration: '5 hours'
      },
      {
        title: 'Emotional Intelligence',
        lessons: ['Self-Awareness', 'Empathy Development', 'Managing Emotions', 'Social Skills'],
        duration: '4.5 hours'
      },
      {
        title: 'Strategic Leadership',
        lessons: ['Strategic Thinking', 'Decision Making', 'Change Management', 'Innovation Leadership'],
        duration: '6 hours'
      }
    ],
    learningOutcomes: [
      'Lead teams effectively',
      'Make strategic decisions',
      'Develop emotional intelligence',
      'Drive organizational change',
      'Advance to senior positions'
    ],
    requirements: ['Some work experience preferred', 'Open mindset for learning', 'Commitment to practice'],
    videoUrl: 'https://www.youtube.com/embed/21X5lGlDOfg'
  },
  {
    _id: '5',
    title: 'Full Stack Web Development (React + Node.js)',
    description: 'Complete full-stack development course. Build modern web applications using React, Node.js, Express, MongoDB. Land your dream developer job.',
    category: 'Technical Skills',
    price: 5999,
    originalPrice: 12999,
    duration: '20 weeks',
    level: 'Beginner to Advanced',
    instructor: 'Arjun Patel',
    instructorBio: 'Senior Developer at Amazon, Full-Stack Expert, 10+ years experience, Open Source Contributor',
    rating: 4.9,
    studentsEnrolled: 32150,
    isPremium: true,
    isBestSeller: true,
    jobGuarantee: true,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500',
    videoCount: 300,
    downloadableResources: 150,
    practiceExercises: 200,
    projects: 15,
    certificate: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'Frontend Development (React)',
        lessons: ['HTML/CSS Mastery', 'JavaScript Advanced', 'React Fundamentals', 'State Management', 'React Router'],
        duration: '40 hours'
      },
      {
        title: 'Backend Development (Node.js)',
        lessons: ['Node.js Basics', 'Express Framework', 'RESTful APIs', 'Authentication', 'File Upload'],
        duration: '35 hours'
      },
      {
        title: 'Database Management',
        lessons: ['MongoDB Basics', 'Mongoose ODM', 'Database Design', 'Aggregation Pipeline'],
        duration: '20 hours'
      },
      {
        title: 'Full Stack Integration',
        lessons: ['Connecting Frontend-Backend', 'State Management', 'Error Handling', 'Testing'],
        duration: '25 hours'
      },
      {
        title: 'Deployment & DevOps',
        lessons: ['Git & GitHub', 'Heroku Deployment', 'AWS Basics', 'CI/CD Pipeline'],
        duration: '15 hours'
      },
      {
        title: 'Major Projects',
        lessons: ['Social Media App', 'E-commerce Platform', 'Blog Management', 'Task Management System'],
        duration: '30 hours'
      }
    ],
    learningOutcomes: [
      'Build complete web applications',
      'Master React and Node.js',
      'Deploy applications to cloud',
      'Work with databases effectively',
      'Get hired as Full Stack Developer'
    ],
    requirements: ['Basic computer knowledge', 'Strong internet connection', 'Dedication to practice daily'],
    videoUrl: 'https://www.youtube.com/embed/nu_pCVPKzTk'
  },
  {
    _id: '6',
    title: 'Business Analytics & Intelligence Masterclass',
    description: 'Master business analytics, Excel advanced, Power BI, SQL, and data-driven decision making. Transform your career with analytics skills.',
    category: 'Analytical Skills',
    price: 3999,
    originalPrice: 7999,
    duration: '12 weeks',
    level: 'Beginner to Advanced',
    instructor: 'Dr. Meera Agarwal',
    instructorBio: 'Business Analytics Consultant, Former Analytics Head at Flipkart, 15+ years experience',
    rating: 4.5,
    studentsEnrolled: 15670,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
    videoCount: 120,
    downloadableResources: 80,
    practiceExercises: 90,
    projects: 6,
    certificate: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'Excel Advanced for Analytics',
        lessons: ['Advanced Formulas', 'Pivot Tables', 'Data Analysis Tools', 'Macros & VBA'],
        duration: '15 hours'
      },
      {
        title: 'SQL for Business Analytics',
        lessons: ['Database Fundamentals', 'Advanced Queries', 'Joins & Subqueries', 'Performance Optimization'],
        duration: '12 hours'
      },
      {
        title: 'Power BI Mastery',
        lessons: ['Data Import & Transformation', 'DAX Formulas', 'Interactive Dashboards', 'Report Publishing'],
        duration: '18 hours'
      },
      {
        title: 'Statistical Analysis for Business',
        lessons: ['Descriptive Analytics', 'Predictive Modeling', 'A/B Testing', 'Forecasting'],
        duration: '15 hours'
      },
      {
        title: 'Real Business Projects',
        lessons: ['Sales Dashboard', 'Customer Analytics', 'Financial Modeling', 'Market Research Analysis'],
        duration: '20 hours'
      }
    ],
    learningOutcomes: [
      'Create powerful business dashboards',
      'Analyze business performance',
      'Make data-driven decisions',
      'Master Excel and Power BI',
      'Get promoted to analyst roles'
    ],
    requirements: ['Basic Excel knowledge', 'Business curiosity', 'Windows computer recommended'],
    videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4'
  },
  {
    _id: '7',
    title: 'Digital Marketing Complete Course',
    description: 'Master all aspects of digital marketing - SEO, Social Media, Google Ads, Email Marketing, Analytics. Start your marketing career or business.',
    category: 'Technical Skills',
    price: 2999,
    originalPrice: 5999,
    duration: '10 weeks',
    level: 'Beginner',
    instructor: 'Rohit Sharma',
    instructorBio: 'Digital Marketing Expert, Founder of successful marketing agency, Google & Facebook certified',
    rating: 4.8,
    studentsEnrolled: 22450,
    isPremium: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    videoCount: 85,
    downloadableResources: 60,
    practiceExercises: 70,
    projects: 5,
    certificate: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'Digital Marketing Fundamentals',
        lessons: ['Digital Marketing Overview', 'Customer Journey', 'Marketing Funnel', 'Goal Setting'],
        duration: '6 hours'
      },
      {
        title: 'Search Engine Optimization (SEO)',
        lessons: ['Keyword Research', 'On-Page SEO', 'Technical SEO', 'Link Building'],
        duration: '12 hours'
      },
      {
        title: 'Social Media Marketing',
        lessons: ['Facebook Marketing', 'Instagram Growth', 'LinkedIn Strategy', 'Content Planning'],
        duration: '10 hours'
      },
      {
        title: 'Paid Advertising',
        lessons: ['Google Ads Mastery', 'Facebook Ads', 'Campaign Optimization', 'ROI Tracking'],
        duration: '15 hours'
      },
      {
        title: 'Analytics & Reporting',
        lessons: ['Google Analytics', 'Conversion Tracking', 'Performance Reports', 'Data Interpretation'],
        duration: '8 hours'
      }
    ],
    learningOutcomes: [
      'Create effective marketing campaigns',
      'Drive traffic and conversions',
      'Master all digital channels',
      'Start marketing agency',
      'Get hired as digital marketer'
    ],
    requirements: ['Basic computer skills', 'Social media familiarity', 'Business mindset'],
    videoUrl: 'https://www.youtube.com/embed/bixR-KIJKYM'
  },
  {
    _id: '8',
    title: 'Public Speaking & Presentation Mastery',
    description: 'Overcome fear of public speaking and become a confident presenter. Learn techniques used by TED speakers and corporate leaders.',
    category: 'Soft Skills',
    price: 1999,
    originalPrice: 3999,
    duration: '5 weeks',
    level: 'Beginner',
    instructor: 'Kavita Malhotra',
    instructorBio: 'TEDx Speaker, Communication Coach, Trained 10,000+ professionals, Corporate Trainer',
    rating: 4.7,
    studentsEnrolled: 9840,
    isPremium: false,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
    videoCount: 40,
    downloadableResources: 25,
    practiceExercises: 35,
    certificate: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'Overcoming Speaking Fear',
        lessons: ['Understanding Anxiety', 'Confidence Building', 'Mindset Shifts', 'Preparation Techniques'],
        duration: '3 hours'
      },
      {
        title: 'Speech Structure & Content',
        lessons: ['Opening Hooks', 'Main Content Organization', 'Storytelling', 'Powerful Conclusions'],
        duration: '4 hours'
      },
      {
        title: 'Delivery Techniques',
        lessons: ['Voice Projection', 'Gestures & Movement', 'Eye Contact', 'Handling Questions'],
        duration: '4 hours'
      },
      {
        title: 'Advanced Presentation Skills',
        lessons: ['Using Visual Aids', 'Engaging Audience', 'Handling Difficult Situations', 'Virtual Presentations'],
        duration: '5 hours'
      }
    ],
    learningOutcomes: [
      'Speak confidently in public',
      'Create engaging presentations',
      'Connect with any audience',
      'Advance your career',
      'Build personal brand'
    ],
    requirements: ['Willingness to practice', 'Access to recording device', 'Open mind for feedback'],
    videoUrl: 'https://www.youtube.com/embed/Unzc731iCUY'
  },
  // FREE COURSES START HERE
  {
    _id: '9',
    title: 'Introduction to Web Development - FREE',
    description: 'Start your web development journey with this completely free course. Learn HTML, CSS basics, and create your first website. Perfect for absolute beginners.',
    category: 'Technical Skills',
    price: 0,
    originalPrice: 0,
    duration: '4 weeks',
    level: 'Beginner',
    instructor: 'Amit Singh',
    instructorBio: 'Web Developer & Educator, 5+ years experience, Passionate about making tech accessible to everyone',
    rating: 4.6,
    studentsEnrolled: 45230,
    isPremium: false,
    isPopular: true,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500',
    videoCount: 25,
    downloadableResources: 15,
    practiceExercises: 20,
    certificate: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'HTML Basics',
        lessons: ['Introduction to HTML', 'Tags and Elements', 'Creating Structure', 'Forms and Tables'],
        duration: '3 hours'
      },
      {
        title: 'CSS Fundamentals',
        lessons: ['CSS Syntax', 'Selectors', 'Colors and Fonts', 'Layout Basics'],
        duration: '4 hours'
      },
      {
        title: 'Building Your First Website',
        lessons: ['Planning Your Site', 'Creating Pages', 'Styling Your Site', 'Making it Responsive'],
        duration: '5 hours'
      }
    ],
    learningOutcomes: [
      'Create basic websites with HTML & CSS',
      'Understand web development fundamentals',
      'Build a portfolio project',
      'Get ready for advanced courses',
      'Start your coding journey'
    ],
    requirements: ['Computer with internet', 'Any web browser', 'Enthusiasm to learn'],
    videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE'
  },
  {
    _id: '10',
    title: 'Basic Communication Skills - FREE',
    description: 'Improve your daily communication with this free introductory course. Learn essential speaking and listening skills that will help in personal and professional life.',
    category: 'Soft Skills',
    price: 0,
    originalPrice: 0,
    duration: '2 weeks',
    level: 'Beginner',
    instructor: 'Neha Gupta',
    instructorBio: 'Communication Trainer, Corporate Trainer for 6+ years, Helped 10,000+ people improve their skills',
    rating: 4.4,
    studentsEnrolled: 32100,
    isPremium: false,
    isPopular: false,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=500',
    videoCount: 15,
    downloadableResources: 8,
    practiceExercises: 12,
    certificate: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'Communication Basics',
        lessons: ['What is Communication?', 'Types of Communication', 'Common Barriers', 'Building Confidence'],
        duration: '2 hours'
      },
      {
        title: 'Effective Speaking',
        lessons: ['Clear Speech', 'Voice Control', 'Body Language Basics', 'Active Listening'],
        duration: '3 hours'
      }
    ],
    learningOutcomes: [
      'Speak more confidently',
      'Listen effectively',
      'Overcome communication anxiety',
      'Express ideas clearly',
      'Build better relationships'
    ],
    requirements: ['Basic understanding of Hindi/English', 'Willingness to practice'],
    videoUrl: 'https://www.youtube.com/embed/HAnw168huqA'
  },
  {
    _id: '11',
    title: 'Introduction to Data Analysis - FREE',
    description: 'Discover the world of data analysis with this free beginner course. Learn basic concepts, tools introduction, and simple analysis techniques using Excel.',
    category: 'Analytical Skills',
    price: 0,
    originalPrice: 0,
    duration: '3 weeks',
    level: 'Beginner',
    instructor: 'Dr. Kavita Rao',
    instructorBio: 'Data Analyst & Educator, PhD in Statistics, Simplified data concepts for 8+ years',
    rating: 4.5,
    studentsEnrolled: 28740,
    isPremium: false,
    isPopular: false,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500',
    videoCount: 18,
    downloadableResources: 12,
    practiceExercises: 15,
    certificate: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'Data Analysis Introduction',
        lessons: ['What is Data?', 'Types of Data', 'Analysis Importance', 'Career Opportunities'],
        duration: '2 hours'
      },
      {
        title: 'Excel for Data Analysis',
        lessons: ['Excel Basics', 'Formulas & Functions', 'Creating Charts', 'Basic Statistics'],
        duration: '4 hours'
      },
      {
        title: 'Practical Projects',
        lessons: ['Sales Data Analysis', 'Survey Analysis', 'Creating Reports', 'Presenting Results'],
        duration: '3 hours'
      }
    ],
    learningOutcomes: [
      'Understand data analysis basics',
      'Use Excel for simple analysis',
      'Create basic charts and reports',
      'Make data-driven decisions',
      'Prepare for advanced courses'
    ],
    requirements: ['Microsoft Excel or Google Sheets', 'Basic computer skills', 'Curiosity about data'],
    videoUrl: 'https://www.youtube.com/embed/Vb7xmjWm5vM'
  },
  {
    _id: '12',
    title: 'Digital Marketing Basics - FREE',
    description: 'Learn the fundamentals of digital marketing completely free. Understand social media, email marketing, and basic SEO concepts to grow your business or career.',
    category: 'Technical Skills',
    price: 0,
    originalPrice: 0,
    duration: '3 weeks',
    level: 'Beginner',
    instructor: 'Rohit Kumar',
    instructorBio: 'Digital Marketing Expert, 7+ years experience, Helped 500+ businesses grow online',
    rating: 4.3,
    studentsEnrolled: 41560,
    isPremium: false,
    isPopular: true,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=500',
    videoCount: 20,
    downloadableResources: 10,
    practiceExercises: 18,
    certificate: true,
    language: 'Hindi + English',
    modules: [
      {
        title: 'Digital Marketing Overview',
        lessons: ['What is Digital Marketing?', 'Different Channels', 'Career Opportunities', 'Success Stories'],
        duration: '2.5 hours'
      },
      {
        title: 'Social Media Marketing',
        lessons: ['Facebook Marketing', 'Instagram Strategies', 'Content Creation', 'Engagement Tips'],
        duration: '3 hours'
      },
      {
        title: 'Email & SEO Basics',
        lessons: ['Email Marketing Introduction', 'Basic SEO Concepts', 'Google My Business', 'Measuring Success'],
        duration: '3.5 hours'
      }
    ],
    learningOutcomes: [
      'Understand digital marketing landscape',
      'Create social media strategies',
      'Start email marketing campaigns',
      'Learn basic SEO principles',
      'Build online presence'
    ],
    requirements: ['Basic internet knowledge', 'Social media accounts', 'Interest in marketing'],
    videoUrl: 'https://www.youtube.com/embed/bixR-KIJKYM'
  }
];

// Auth functions
export const authAPI = {
  login: async (credentials) => {
    console.log('Mock login for:', credentials.email);
    return {
      data: {
        success: true,
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          _id: '1',
          name: credentials.email.split('@')[0],
          email: credentials.email,
          role: credentials.email.includes('admin') ? 'admin' : 'student'
        }
      }
    };
  },

  register: async (userData) => {
    console.log('Mock register for:', userData.email);
    return {
      data: {
        success: true,
        token: 'mock_jwt_token_' + Date.now(),
        user: {
          _id: Date.now().toString(),
          name: userData.name,
          email: userData.email,
          role: userData.role || 'student'
        }
      }
    };
  },

  getProfile: async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      data: {
        success: true,
        user: user
      }
    };
  },

  updateProfile: async (profileData) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return {
      data: {
        success: true,
        user: updatedUser
      }
    };
  },

  changePassword: async () => {
    return {
      data: {
        success: true,
        message: 'Password updated successfully'
      }
    };
  }
};

// Course functions
export const courseAPI = {
  getCourses: async (filters = {}) => {
    let filteredCourses = [...mockCourses];
    
    if (filters.category) {
      filteredCourses = filteredCourses.filter(course => course.category === filters.category);
    }
    
    return {
      data: {
        success: true,
        courses: filteredCourses
      }
    };
  },

  getCourse: async (courseId) => {
    const course = mockCourses.find(c => c._id === courseId);
    if (course) {
      return {
        data: {
          success: true,
          course: course
        }
      };
    }
    throw new Error('Course not found');
  },

  enrollCourse: async (courseId) => {
    const course = mockCourses.find(c => c._id === courseId);
    return {
      data: {
        success: true,
        message: 'Successfully enrolled',
        course: course
      }
    };
  },

  getEnrolledCourses: async () => {
    return {
      data: {
        success: true,
        courses: mockCourses.slice(0, 2)
      }
    };
  },

  addReview: async (courseId, reviewData) => {
    return {
      data: {
        success: true,
        message: 'Review added successfully'
      }
    };
  }
};

// Payment functions
export const paymentAPI = {
  createPaymentIntent: async (courseId, amount) => {
    return {
      data: {
        success: true,
        clientSecret: 'pi_mock_' + Date.now() + '_secret_mock'
      }
    };
  },

  confirmPayment: async () => {
    return {
      data: {
        success: true,
        message: 'Payment successful'
      }
    };
  }
};

// Enrollment functions
export const enrollmentAPI = {
  enrollCourse: async (courseId) => {
    const course = mockCourses.find(c => c._id === courseId);
    return {
      data: {
        success: true,
        message: 'Successfully enrolled',
        course: course
      }
    };
  },

  unenrollCourse: async (courseId) => {
    return {
      data: {
        success: true,
        message: 'Successfully unenrolled'
      }
    };
  },

  getEnrolledCourses: async () => {
    return {
      data: {
        success: true,
        courses: mockCourses.slice(0, 2)
      }
    };
  },

  updateProgress: async (courseId, progress) => {
    return {
      data: {
        success: true,
        message: 'Progress updated',
        progress: progress
      }
    };
  },

  checkEnrollment: async (courseId) => {
    return {
      data: {
        success: true,
        isEnrolled: true, // Mock as enrolled for demo
        enrollmentDate: new Date().toISOString()
      }
    };
  }
};

// Utility functions
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const handleApiError = (error) => {
  return error.message || 'An error occurred';
};

export default api;
