// Course-specific quiz questions
export const courseQuizzes = {
  "communication-skills": [
    { 
      id: 'q1', 
      type: 'mcq', 
      question: 'What are the key components of the communication process?', 
      options: [
        'Sender, Message, Medium, Receiver, Feedback', 
        'Speaker, Listener, Topic', 
        'Question, Answer, Discussion', 
        'Talking, Hearing, Understanding'
      ], 
      answer: 0 
    },
    { 
      id: 'q2', 
      type: 'mcq', 
      question: 'Which percentage of communication is body language according to studies?', 
      options: ['7%', '38%', '55%', '80%'], 
      answer: 2 
    },
    { 
      id: 'q3', 
      type: 'mcq', 
      question: 'What is the most important skill in active listening?', 
      options: [
        'Interrupting to show you understand', 
        'Giving full attention and eliminating distractions', 
        'Thinking about your response while others speak', 
        'Nodding constantly'
      ], 
      answer: 1 
    },
    { 
      id: 'q4', 
      type: 'mcq', 
      question: 'In business communication, what is the primary purpose of written documentation?', 
      options: [
        'To impress colleagues', 
        'To provide a permanent record and clarity', 
        'To show off writing skills', 
        'To avoid face-to-face meetings'
      ], 
      answer: 1 
    },
    { 
      id: 'q5', 
      type: 'mcq', 
      question: 'What is the best approach to handle communication barriers?', 
      options: [
        'Ignore them and hope they go away', 
        'Blame the other person', 
        'Identify the barrier and adapt your communication style', 
        'Speak louder'
      ], 
      answer: 2 
    },
    { 
      id: 'q6', 
      type: 'mcq', 
      question: 'Which of these is NOT a type of non-verbal communication?', 
      options: ['Body language', 'Facial expressions', 'Email messages', 'Tone of voice'], 
      answer: 2 
    },
    { 
      id: 'q7', 
      type: 'mcq', 
      question: 'What does empathy in communication mean?', 
      options: [
        'Agreeing with everything someone says', 
        'Understanding and sharing the feelings of others', 
        'Feeling sorry for someone', 
        'Avoiding difficult conversations'
      ], 
      answer: 1 
    },
    { 
      id: 'q8', 
      type: 'mcq', 
      question: 'What is the recommended approach for giving constructive feedback?', 
      options: [
        'Be vague to avoid hurting feelings', 
        'Focus only on negatives', 
        'Be specific, balanced, and solution-oriented', 
        'Give feedback in public settings'
      ], 
      answer: 2 
    },
    {
      id: 'q9',
      type: 'essay',
      question: 'Explain the importance of active listening in professional communication and describe at least three techniques you can use to improve your active listening skills.',
      keywords: ['attention', 'focus', 'eye contact', 'paraphrase', 'clarifying questions', 'feedback', 'understand', 'empathy', 'interrupting', 'distractions']
    },
    {
      id: 'q10',
      type: 'essay',
      question: 'Describe a real-life situation where poor communication led to a problem, and explain how effective communication could have prevented it. Include specific communication strategies.',
      keywords: ['misunderstanding', 'clear', 'feedback', 'clarify', 'listen', 'barriers', 'message', 'context', 'assumptions', 'conflict', 'resolution', 'strategy']
    }
  ],
  
  "web-development": [
    { 
      id: 'q1', 
      type: 'mcq', 
      question: 'What does HTML stand for?', 
      options: ['Hyperlinks and Text Markup', 'Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyper Trainer Marking Language'], 
      answer: 1 
    },
    { 
      id: 'q2', 
      type: 'mcq', 
      question: 'Which HTML tag is used to define an internal style sheet?', 
      options: ['<css>', '<script>', '<style>', '<link>'], 
      answer: 2 
    },
    { 
      id: 'q3', 
      type: 'mcq', 
      question: 'What is the correct CSS syntax for making all <p> elements bold?', 
      options: ['<p style="font-weight:bold">', 'p {font-weight:bold;}', 'p {text-size:bold;}', '<p style="bold">'], 
      answer: 1 
    },
    { 
      id: 'q4', 
      type: 'mcq', 
      question: 'Which property is used to change the background color in CSS?', 
      options: ['bgcolor', 'background-color', 'color', 'bg-color'], 
      answer: 1 
    },
    { 
      id: 'q5', 
      type: 'mcq', 
      question: 'What is the purpose of the <head> tag in HTML?', 
      options: [
        'To contain the main content', 
        'To contain metadata and links to stylesheets/scripts', 
        'To create headers', 
        'To define the footer'
      ], 
      answer: 1 
    },
    { 
      id: 'q6', 
      type: 'mcq', 
      question: 'Which CSS property controls the text size?', 
      options: ['text-style', 'font-size', 'text-size', 'font-style'], 
      answer: 1 
    },
    { 
      id: 'q7', 
      type: 'mcq', 
      question: 'What is the correct way to link an external CSS file?', 
      options: [
        '<css>styles.css</css>', 
        '<link rel="stylesheet" href="styles.css">', 
        '<style src="styles.css">', 
        '<stylesheet>styles.css</stylesheet>'
      ], 
      answer: 1 
    },
    { 
      id: 'q8', 
      type: 'mcq', 
      question: 'What does the "box model" in CSS consist of?', 
      options: [
        'Content, Border, Margin', 
        'Content, Padding, Border, Margin', 
        'Width, Height, Padding', 
        'Content, Width, Height'
      ], 
      answer: 1 
    },
    {
      id: 'q9',
      type: 'essay',
      question: 'Explain the difference between HTML, CSS, and JavaScript in web development. Describe the role each plays in creating a modern website.',
      keywords: ['structure', 'content', 'styling', 'presentation', 'behavior', 'interactive', 'markup', 'design', 'functionality', 'dynamic']
    },
    {
      id: 'q10',
      type: 'essay',
      question: 'Describe the key principles of responsive web design and why it is important in modern web development. Include specific techniques used to achieve responsiveness.',
      keywords: ['mobile', 'flexible', 'media queries', 'viewport', 'grid', 'breakpoints', 'fluid', 'adaptive', 'devices', 'screen sizes', 'layout']
    }
  ],

  "advanced-javascript": [
    { 
      id: 'q1', 
      type: 'mcq', 
      question: 'What is a closure in JavaScript?', 
      options: [
        'A way to close HTTP connections', 
        'A function bundled with its lexical environment', 
        'An HTML tag', 
        'A CSS selector'
      ], 
      answer: 1 
    },
    { 
      id: 'q2', 
      type: 'mcq', 
      question: 'Which method is used to add elements to the end of an array?', 
      options: ['append()', 'push()', 'add()', 'insert()'], 
      answer: 1 
    },
    { 
      id: 'q3', 
      type: 'mcq', 
      question: 'What does "this" keyword refer to in JavaScript?', 
      options: [
        'The current function', 
        'The global object', 
        'The object that is executing the current function', 
        'The parent element'
      ], 
      answer: 2 
    },
    { 
      id: 'q4', 
      type: 'mcq', 
      question: 'What is the difference between "==" and "===" in JavaScript?', 
      options: [
        'No difference', 
        '== checks value, === checks value and type', 
        '=== is faster', 
        '== is deprecated'
      ], 
      answer: 1 
    },
    { 
      id: 'q5', 
      type: 'mcq', 
      question: 'What is the purpose of async/await in JavaScript?', 
      options: [
        'To make code run faster', 
        'To handle asynchronous operations in a synchronous manner', 
        'To create delays', 
        'To define classes'
      ], 
      answer: 1 
    },
    { 
      id: 'q6', 
      type: 'mcq', 
      question: 'Which array method creates a new array with results of calling a function for every element?', 
      options: ['forEach()', 'filter()', 'map()', 'reduce()'], 
      answer: 2 
    },
    { 
      id: 'q7', 
      type: 'mcq', 
      question: 'What is event bubbling in JavaScript?', 
      options: [
        'When events float to the top', 
        'When an event propagates from child to parent elements', 
        'When events are cancelled', 
        'When multiple events fire simultaneously'
      ], 
      answer: 1 
    },
    { 
      id: 'q8', 
      type: 'mcq', 
      question: 'What is the purpose of the "use strict" directive?', 
      options: [
        'Makes code run faster', 
        'Enables strict mode for safer coding practices', 
        'Required for ES6', 
        'Disables certain features'
      ], 
      answer: 1 
    },
    {
      id: 'q9',
      type: 'essay',
      question: 'Explain what Promises are in JavaScript and how they help manage asynchronous operations. Include examples of their methods.',
      keywords: ['asynchronous', 'callback', 'then', 'catch', 'resolve', 'reject', 'pending', 'fulfilled', 'chain', 'async']
    },
    {
      id: 'q10',
      type: 'essay',
      question: 'Describe the concept of closures in JavaScript and provide a practical use case where closures are beneficial in real-world applications.',
      keywords: ['function', 'scope', 'lexical', 'environment', 'encapsulation', 'private', 'variables', 'inner', 'outer', 'memory']
    }
  ],

  "react-development": [
    { 
      id: 'q1', 
      type: 'mcq', 
      question: 'Which company developed React?', 
      options: ['Google', 'Microsoft', 'Facebook/Meta', 'Twitter'], 
      answer: 2 
    },
    { 
      id: 'q2', 
      type: 'mcq', 
      question: 'What is JSX in React?', 
      options: [
        'A JavaScript library', 
        'JavaScript XML - syntax extension', 
        'A CSS framework', 
        'A testing tool'
      ], 
      answer: 1 
    },
    { 
      id: 'q3', 
      type: 'mcq', 
      question: 'What Hook is used to manage state in functional components?', 
      options: ['useEffect', 'useState', 'useContext', 'useReducer'], 
      answer: 1 
    },
    { 
      id: 'q4', 
      type: 'mcq', 
      question: 'What is the Virtual DOM in React?', 
      options: [
        'A copy of the actual DOM', 
        'A lightweight representation of the real DOM', 
        'A database', 
        'A testing environment'
      ], 
      answer: 1 
    },
    { 
      id: 'q5', 
      type: 'mcq', 
      question: 'What is the purpose of useEffect Hook?', 
      options: [
        'To create effects', 
        'To handle side effects and lifecycle methods', 
        'To style components', 
        'To manage forms'
      ], 
      answer: 1 
    },
    { 
      id: 'q6', 
      type: 'mcq', 
      question: 'What are props in React?', 
      options: [
        'Properties passed from parent to child components', 
        'CSS properties', 
        'Component methods', 
        'State variables'
      ], 
      answer: 0 
    },
    { 
      id: 'q7', 
      type: 'mcq', 
      question: 'Which method is used to update state in class components?', 
      options: ['updateState()', 'setState()', 'changeState()', 'modifyState()'], 
      answer: 1 
    },
    { 
      id: 'q8', 
      type: 'mcq', 
      question: 'What is React Router used for?', 
      options: [
        'API routing', 
        'Client-side routing in single-page applications', 
        'Server routing', 
        'Data routing'
      ], 
      answer: 1 
    },
    {
      id: 'q9',
      type: 'essay',
      question: 'Explain the difference between state and props in React. When would you use each, and how do they affect component rendering?',
      keywords: ['mutable', 'immutable', 'parent', 'child', 'data', 'component', 'update', 'render', 'flow', 'pass']
    },
    {
      id: 'q10',
      type: 'essay',
      question: 'Describe the React component lifecycle and explain how Hooks like useEffect replace traditional lifecycle methods in functional components.',
      keywords: ['mount', 'update', 'unmount', 'lifecycle', 'useEffect', 'dependency', 'cleanup', 'render', 'side effects', 'functional']
    }
  ],

  "data-analysis": [
    { 
      id: 'q1', 
      type: 'mcq', 
      question: 'What is the first step in the data analysis process?', 
      options: [
        'Data visualization', 
        'Define the question or problem', 
        'Data modeling', 
        'Report writing'
      ], 
      answer: 1 
    },
    { 
      id: 'q2', 
      type: 'mcq', 
      question: 'Which Python library is most commonly used for data manipulation?', 
      options: ['NumPy', 'Pandas', 'Matplotlib', 'SciPy'], 
      answer: 1 
    },
    { 
      id: 'q3', 
      type: 'mcq', 
      question: 'What does "data cleaning" involve?', 
      options: [
        'Deleting all data', 
        'Removing errors, duplicates, and handling missing values', 
        'Creating charts', 
        'Backing up data'
      ], 
      answer: 1 
    },
    { 
      id: 'q4', 
      type: 'mcq', 
      question: 'What is the purpose of data visualization?', 
      options: [
        'To make data look pretty', 
        'To communicate insights and patterns effectively', 
        'To hide data problems', 
        'To reduce file size'
      ], 
      answer: 1 
    },
    { 
      id: 'q5', 
      type: 'mcq', 
      question: 'Which measure of central tendency is most affected by outliers?', 
      options: ['Mean', 'Median', 'Mode', 'Range'], 
      answer: 0 
    },
    { 
      id: 'q6', 
      type: 'mcq', 
      question: 'What is exploratory data analysis (EDA)?', 
      options: [
        'Creating final reports', 
        'Initial investigation to discover patterns and insights', 
        'Cleaning data', 
        'Collecting data'
      ], 
      answer: 1 
    },
    { 
      id: 'q7', 
      type: 'mcq', 
      question: 'What type of chart is best for showing trends over time?', 
      options: ['Pie chart', 'Bar chart', 'Line chart', 'Scatter plot'], 
      answer: 2 
    },
    { 
      id: 'q8', 
      type: 'mcq', 
      question: 'What is the correlation coefficient used for?', 
      options: [
        'To measure file size', 
        'To measure the relationship between two variables', 
        'To count data points', 
        'To clean data'
      ], 
      answer: 1 
    },
    {
      id: 'q9',
      type: 'essay',
      question: 'Explain the importance of data cleaning in data analysis and describe at least three common data quality issues that need to be addressed.',
      keywords: ['missing', 'duplicates', 'outliers', 'inconsistent', 'accuracy', 'quality', 'errors', 'validation', 'integrity', 'preprocessing']
    },
    {
      id: 'q10',
      type: 'essay',
      question: 'Describe the difference between descriptive and inferential statistics. Provide examples of when each type would be used in data analysis.',
      keywords: ['descriptive', 'summarize', 'mean', 'median', 'inferential', 'prediction', 'hypothesis', 'population', 'sample', 'conclusion', 'patterns']
    }
  ],

  // Default quiz for courses without specific questions
  "default": [
    { 
      id: 'q1', 
      type: 'mcq', 
      question: 'What is the most important factor in successful learning?', 
      options: ['Memorization', 'Consistent practice and application', 'Speed', 'Natural talent'], 
      answer: 1 
    },
    { 
      id: 'q2', 
      type: 'mcq', 
      question: 'How should you approach problem-solving in this field?', 
      options: [
        'Always use the same method', 
        'Break down problems and analyze systematically', 
        'Guess and check', 
        'Skip difficult problems'
      ], 
      answer: 1 
    },
    { 
      id: 'q3', 
      type: 'mcq', 
      question: 'What is the best way to retain knowledge from this course?', 
      options: [
        'Re-watch videos once', 
        'Practice regularly and apply concepts', 
        'Read notes quickly', 
        'Memorize everything'
      ], 
      answer: 1 
    },
    { 
      id: 'q4', 
      type: 'mcq', 
      question: 'Why is continuous learning important in this field?', 
      options: [
        'It\'s not important', 
        'Fields evolve and new techniques emerge', 
        'To impress others', 
        'It\'s required by law'
      ], 
      answer: 1 
    },
    { 
      id: 'q5', 
      type: 'mcq', 
      question: 'How can you best apply what you\'ve learned?', 
      options: [
        'Wait for perfect conditions', 
        'Start with small practical projects', 
        'Only use it at work', 
        'Keep it theoretical'
      ], 
      answer: 1 
    },
    { 
      id: 'q6', 
      type: 'mcq', 
      question: 'What should you do when facing challenges?', 
      options: [
        'Give up immediately', 
        'Research, practice, and seek help when needed', 
        'Skip to easier topics', 
        'Blame the course'
      ], 
      answer: 1 
    },
    { 
      id: 'q7', 
      type: 'mcq', 
      question: 'How important is hands-on practice?', 
      options: [
        'Not important', 
        'Essential for mastery', 
        'Optional', 
        'Only for beginners'
      ], 
      answer: 1 
    },
    { 
      id: 'q8', 
      type: 'mcq', 
      question: 'What makes a good learner?', 
      options: [
        'Natural intelligence only', 
        'Curiosity, persistence, and willingness to learn from mistakes', 
        'Perfect memory', 
        'Fast reading speed'
      ], 
      answer: 1 
    },
    {
      id: 'q9',
      type: 'essay',
      question: 'Describe three key concepts you learned from this course and explain how you plan to apply them in real-world scenarios.',
      keywords: ['concept', 'learning', 'apply', 'practical', 'understanding', 'skill', 'knowledge', 'implementation', 'real-world', 'experience']
    },
    {
      id: 'q10',
      type: 'essay',
      question: 'Reflect on your learning journey in this course. What challenges did you face, and what strategies helped you overcome them?',
      keywords: ['challenge', 'overcome', 'strategy', 'learning', 'practice', 'improvement', 'persistence', 'solution', 'growth', 'understanding']
    }
  ]
};

// Function to get quiz for a specific course
export const getQuizForCourse = (courseId) => {
  return courseQuizzes[courseId] || courseQuizzes['default'];
};
