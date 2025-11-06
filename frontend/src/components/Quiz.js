import React, { useState } from 'react';
import toast from 'react-hot-toast';

// Simple Quiz component: 8 MCQ + 2 short-answer (keyword-based grading)
const defaultQuestions = [
  { id: 'q1', type: 'mcq', question: 'What does HTML stand for?', options: ['Hyperlinks and Text Markup', 'Hyper Text Markup Language', 'Home Tool Markup Language', 'Hyper Trainer Marking Language'], answer: 1 },
  { id: 'q2', type: 'mcq', question: 'Which tag is used to include JavaScript?', options: ['<script>', '<js>', '<javascript>', '<code>'], answer: 0 },
  { id: 'q3', type: 'mcq', question: 'Which company developed React?', options: ['Google', 'Microsoft', 'Facebook', 'Twitter'], answer: 2 },
  { id: 'q4', type: 'mcq', question: 'Which property is used to change text color in CSS?', options: ['font-color', 'color', 'text-color', 'fg-color'], answer: 1 },
  { id: 'q5', type: 'mcq', question: 'Which HTTP method is typically used to create a new resource?', options: ['GET', 'PUT', 'POST', 'DELETE'], answer: 2 },
  { id: 'q6', type: 'mcq', question: 'What is a closure in JavaScript?', options: ['A function bundled with its lexical environment', 'A way to close HTTP connections', 'An HTML tag', 'A CSS selector'], answer: 0 },
  { id: 'q7', type: 'mcq', question: 'Which method converts a JSON string to an object in JavaScript?', options: ['JSON.stringify', 'JSON.parse', 'JSON.toObject', 'JSON.convert'], answer: 1 },
  { id: 'q8', type: 'mcq', question: 'Which data structure uses FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 1 },
  // Essay / short answers with keywords
  { id: 'q9', type: 'essay', question: 'Explain in brief what REST APIs are and why they are useful.', keywords: ['representational', 'state', 'transfer', 'stateless', 'http'] },
  { id: 'q10', type: 'essay', question: 'Describe a strategy to debug a production issue in a web app.', keywords: ['logs', 'replicate', 'monitoring', 'rollback', 'root cause'] }
];

const Quiz = ({ courseId, onComplete, questions = defaultQuestions }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [scorePercent, setScorePercent] = useState(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const grade = () => {
    let correct = 0;
    let total = questions.length;
    let autoCorrectCount = 0;

    questions.forEach(q => {
      const ans = answers[q.id];
      if (q.type === 'mcq') {
        if (typeof ans === 'number' && ans === q.answer) correct += 1;
        autoCorrectCount += 1;
      } else if (q.type === 'essay') {
        // Keyword-match grading - no minimum length requirement
        const text = (ans || '').trim().toLowerCase();
        
        // Check keyword relevance - need at least 60% of keywords present
        const found = q.keywords.filter(k => text.includes(k.toLowerCase())).length;
        const requiredKeywords = Math.ceil(q.keywords.length * 0.6); // At least 60% keywords
        const pass = found >= requiredKeywords;
        
        if (pass) correct += 1;
      }
    });

    const percent = Math.round((correct / total) * 100);
    return { percent, correct, total };
  };

  const handleSubmit = () => {
    // Validate that all questions are answered
    const unansweredMcq = questions.filter(q => q.type === 'mcq' && answers[q.id] === undefined).length;
    const emptyEssays = questions.filter(q => q.type === 'essay' && (!answers[q.id] || answers[q.id].trim().length === 0)).length;
    
    if (unansweredMcq > 0 || emptyEssays > 0) {
      toast.error('Please answer all questions before submitting!');
      return;
    }
    
    // Validate essay answers have relevant content (at least one keyword)
    const invalidEssays = questions.filter(q => {
      if (q.type === 'essay') {
        const ans = answers[q.id] || '';
        const text = ans.trim().toLowerCase();
        
        // Must contain at least one keyword to be considered relevant
        const hasKeyword = q.keywords.some(k => text.includes(k.toLowerCase()));
        if (!hasKeyword) {
          return true;
        }
      }
      return false;
    });
    
    if (invalidEssays.length > 0) {
      toast.error('Please provide relevant answers to the essay questions (must include related keywords).');
      return;
    }
    
    const { percent } = grade();
    setScorePercent(percent);
    setSubmitted(true);

    const passed = percent >= 85; // pass threshold increased to 85%

    if (passed) {
      // Show name prompt before issuing certificate
      setShowNamePrompt(true);
    } else {
      toast('Quiz submitted. You scored ' + percent + '%. You need 85% to pass. Please review the course and try again.');
      // store progress even if failed
      const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      progress[courseId] = progress[courseId] || {};
      progress[courseId].quiz = { percent, passed };
      localStorage.setItem('courseProgress', JSON.stringify(progress));
      if (onComplete) onComplete({ percent, passed });
    }
  };

  const issueCertificate = () => {
    if (!fullName.trim()) {
      toast.error('Please enter your full name for the certificate');
      return;
    }

    // Get user from localStorage and update with fullName
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.fullName = fullName.trim();
    localStorage.setItem('user', JSON.stringify(user));

    // persist certificate in localStorage
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    const cert = {
      _id: `${courseId}-${Date.now()}`,
      courseId,
      courseTitle: courseId,
      instructor: 'Expert Instructor',
      completedAt: new Date(),
      score: scorePercent,
      certificateNumber: `LH-${courseId.toUpperCase()}-${Date.now()}`,
      isVerified: true,
      skills: [],
      studentName: fullName.trim()
    };
    certificates.push(cert);
    localStorage.setItem('certificates', JSON.stringify(certificates));

    // store course progress
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    progress[courseId] = progress[courseId] || {};
    progress[courseId].quiz = { percent: scorePercent, passed: true };
    localStorage.setItem('courseProgress', JSON.stringify(progress));

    toast.success(`Congratulations! Certificate issued for ${fullName}`);
    setShowNamePrompt(false);

    if (onComplete) onComplete({ percent: scorePercent, passed: true });
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Final Quiz</h3>
      <p className="text-sm text-gray-600 mb-4">
        Answer all questions carefully. Essay questions must include relevant keywords related to the topic. 
        <strong> Passing score: 85%</strong>
      </p>

      {questions.map((q, idx) => (
        <div key={q.id} className="mb-4">
          <div className="font-medium mb-2">{idx + 1}. {q.question}</div>
          {q.type === 'mcq' ? (
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[q.id] === oi;
                const isCorrect = oi === q.answer;
                const showCorrect = submitted && isCorrect;
                const showIncorrect = submitted && isSelected && !isCorrect;
                
                return (
                  <label 
                    key={oi} 
                    className={`flex items-center gap-2 p-2 rounded ${
                      showCorrect ? 'bg-green-100 border-2 border-green-500' : 
                      showIncorrect ? 'bg-red-100 border-2 border-red-500' : 
                      ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={isSelected}
                      onChange={() => handleChange(q.id, oi)}
                      disabled={submitted}
                    />
                    <span className={showCorrect ? 'font-semibold text-green-700' : showIncorrect ? 'text-red-700' : ''}>
                      {opt}
                      {showCorrect && ' ✓ (Correct Answer)'}
                      {showIncorrect && ' ✗ (Your Answer)'}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <div>
              <textarea
                rows={4}
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                disabled={submitted}
                placeholder="Write your answer with relevant keywords..."
                className="w-full p-2 border rounded"
              />
              {submitted && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-semibold text-blue-800 mb-1">Expected Keywords:</div>
                  <div className="text-sm text-blue-700">
                    {q.keywords.map((keyword, ki) => {
                      const userAnswer = (answers[q.id] || '').toLowerCase();
                      const found = userAnswer.includes(keyword.toLowerCase());
                      return (
                        <span 
                          key={ki}
                          className={`inline-block px-2 py-1 m-1 rounded ${
                            found ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {keyword} {found ? '✓' : ''}
                        </span>
                      );
                    })}
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    💡 A good answer should include at least 60% of these keywords to be considered correct.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <div className="flex gap-3">
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Submit Quiz
          </button>
        </div>
      ) : showNamePrompt ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-800 mb-3">🎉 Congratulations! You passed!</h4>
          <p className="text-green-700 mb-4">Your score: <strong>{scorePercent}%</strong></p>
          <p className="text-gray-700 mb-4">Please enter your full name as it should appear on your certificate:</p>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name (e.g., John Michael Smith)"
            className="w-full p-3 border border-gray-300 rounded mb-4"
          />
          <div className="flex gap-3">
            <button 
              onClick={issueCertificate}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Issue Certificate
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            ⓘ Make sure your name is spelled correctly. You can request a name change later if needed.
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-2">Your score: <strong>{scorePercent}%</strong></div>
          {scorePercent >= 85 ? (
            <div className="text-green-600 font-semibold">Certificate has been issued! Check the Certificates page.</div>
          ) : (
            <div className="text-yellow-600">You scored {scorePercent}%, but need 85% to pass. Please review the course and try again.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
