const express = require('express');

const router = express.Router();

// Simple chatbot responses (in a real application, this would integrate with OpenAI or similar)
const responses = {
  greeting: [
    "Hello! How can I help you with your learning journey today?",
    "Hi there! I'm here to assist you with any questions about our courses.",
    "Welcome! What would you like to know about our learning platform?"
  ],
  courses: [
    "We offer three main categories: Soft Skills, Technical Skills, and Analytical Skills. Each category has multiple courses ranging from beginner to advanced levels.",
    "Our courses include both free basic content and premium advanced content. You can find courses in communication, programming, data analysis, and much more!",
    "All our courses come with video lectures, written materials, and assessments. Premium courses also include certificates upon completion."
  ],
  enrollment: [
    "To enroll in a free course, simply click the 'Enroll Now' button on the course page. For premium courses, you'll need to complete the payment process.",
    "Once enrolled, you can access all course materials, track your progress, and take assessments. Your progress is saved automatically.",
    "You can view all your enrolled courses in the 'My Courses' section of your dashboard."
  ],
  payment: [
    "We accept all major credit cards through Stripe. All payments are secure and encrypted.",
    "Premium courses offer advanced content, downloadable resources, and certificates upon completion.",
    "If you need a refund, please contact our support team with your order details."
  ],
  certificates: [
    "You can earn certificates by completing premium courses and passing the final assessment with a score of 70% or higher.",
    "Certificates are downloadable as PDF files and include your name, course title, completion date, and verification code.",
    "All certificates are digitally signed and can be shared on LinkedIn or included in your resume."
  ],
  technical: [
    "If you're experiencing technical issues, try refreshing your browser or clearing your cache.",
    "For video playback issues, ensure you have a stable internet connection and try switching to a different browser.",
    "If problems persist, please contact our technical support team."
  ],
  default: [
    "I'm here to help! You can ask me about courses, enrollment, payments, certificates, or any technical issues.",
    "Try asking me about our course categories, how to enroll, or how to earn certificates.",
    "If you need specific help that I can't provide, please contact our support team."
  ]
};

// Simple keyword matching function
function getResponseCategory(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'greeting';
  }
  
  if (lowerMessage.includes('course') || lowerMessage.includes('learn') || lowerMessage.includes('skill')) {
    return 'courses';
  }
  
  if (lowerMessage.includes('enroll') || lowerMessage.includes('join') || lowerMessage.includes('register')) {
    return 'enrollment';
  }
  
  if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return 'payment';
  }
  
  if (lowerMessage.includes('certificate') || lowerMessage.includes('completion') || lowerMessage.includes('credential')) {
    return 'certificates';
  }
  
  if (lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('error') || lowerMessage.includes('bug')) {
    return 'technical';
  }
  
  return 'default';
}

// @route   POST /api/chatbot/message
// @desc    Process chatbot message
// @access  Public
router.post('/message', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get response category based on keywords
    const category = getResponseCategory(message);
    
    // Get random response from category
    const categoryResponses = responses[category];
    const randomResponse = categoryResponses[Math.floor(Math.random() * categoryResponses.length)];

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    res.json({
      success: true,
      data: {
        response: randomResponse,
        category,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Chatbot service error'
    });
  }
});

// @route   GET /api/chatbot/suggestions
// @desc    Get suggested questions
// @access  Public
router.get('/suggestions', (req, res) => {
  const suggestions = [
    "What courses do you offer?",
    "How do I enroll in a course?",
    "How much do premium courses cost?",
    "How do I earn a certificate?",
    "What's the difference between free and premium content?",
    "How do I track my progress?",
    "Can I get a refund?",
    "How do assessments work?",
    "What payment methods do you accept?",
    "How do I contact support?"
  ];

  res.json({
    success: true,
    data: suggestions
  });
});

// @route   GET /api/chatbot/help
// @desc    Get chatbot help information
// @access  Public
router.get('/help', (req, res) => {
  const helpInfo = {
    topics: [
      {
        title: "Courses & Learning",
        keywords: ["courses", "learning", "skills", "categories"],
        description: "Ask about our course offerings, skill categories, and learning paths"
      },
      {
        title: "Enrollment & Access",
        keywords: ["enroll", "join", "access", "registration"],
        description: "Get help with enrolling in courses and accessing content"
      },
      {
        title: "Payments & Pricing",
        keywords: ["payment", "price", "cost", "premium", "refund"],
        description: "Information about pricing, payment methods, and refunds"
      },
      {
        title: "Certificates & Progress",
        keywords: ["certificate", "progress", "completion", "assessment"],
        description: "Learn about earning certificates and tracking progress"
      },
      {
        title: "Technical Support",
        keywords: ["problem", "issue", "error", "technical", "help"],
        description: "Get help with technical issues and troubleshooting"
      }
    ],
    tips: [
      "Be specific in your questions for better responses",
      "Use keywords related to your topic of interest",
      "Ask one question at a time for clearer answers",
      "Contact human support for complex issues"
    ]
  };

  res.json({
    success: true,
    data: helpInfo
  });
});

module.exports = router;