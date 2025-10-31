import React, { useState, useRef, useEffect } from 'react';
import { 
  FaComments, 
  FaPaperPlane, 
  FaTimes, 
  FaRobot,
  FaUser,
  FaQuestionCircle,
  FaGraduationCap,
  FaCreditCard,
  FaExpand,
  FaCompress
} from 'react-icons/fa';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your learning assistant powered by AI. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Gemini API configuration
  const GEMINI_API_KEY = 'AIzaSyBnvfSXhsDGGjk9ZW1cXIRsQcpibHsXB34';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    { text: "Course Information", icon: FaGraduationCap },
    { text: "Payment Help", icon: FaCreditCard },
    { text: "Technical Support", icon: FaQuestionCircle },
  ];

  // Call Gemini API for intelligent responses
  const getGeminiResponse = async (userMessage) => {
    try {
      const contextPrompt = `You are a helpful learning assistant for an online Learning Management System (LMS). 
Our platform offers three course categories:
1. Soft Skills - Communication, Leadership (Price: $99-$129)
2. Technical Skills - Programming, Web Development, React, JavaScript (Price: $149-$179)
3. Analytical Skills - Data Analysis, Statistics, Python (Price: $159-$199)

Features:
- All courses include lifetime access and certificates
- Secure payment with Stripe
- 30-day money-back guarantee
- 24/7 support available

Answer the user's question in a helpful, friendly, and concise manner. Keep responses brief (2-3 sentences unless more detail is needed).

User question: ${userMessage}`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: contextPrompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponse) {
        throw new Error('Invalid response format');
      }

      return aiResponse;
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "I apologize, but I'm having trouble connecting right now. Please try again or contact our support team at support@lms.com for immediate assistance.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      // Get AI response from Gemini
      const aiResponse = await getGeminiResponse(messageToSend);
      
      const botResponse = {
        id: Date.now() + 1,
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "I apologize for the inconvenience. Please try again or contact support.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply) => {
    setInputValue(reply);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          <FaComments className="text-2xl" />
          <span className="ml-2 hidden sm:block">Chat with us</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className={`bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 transition-all duration-300 ${
            isExpanded 
              ? 'fixed inset-4 w-auto h-auto' 
              : 'w-80 sm:w-96 h-96 sm:h-[500px]'
          }`}
        >
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center">
              <FaRobot className="text-xl mr-2" />
              <div>
                <h3 className="font-semibold">AI Learning Assistant</h3>
                <p className="text-xs text-primary-100">Powered by Gemini AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary-100 hover:text-white p-1"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-100 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-start space-x-2 ${isExpanded ? 'max-w-2xl' : 'max-w-xs'} ${message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.isBot ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}`}>
                    {message.isBot ? <FaRobot /> : <FaUser />}
                  </div>
                  <div className={`p-3 rounded-lg ${message.isBot ? 'bg-gray-100 text-gray-800' : 'bg-primary-600 text-white'}`}>
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.isBot ? 'text-gray-500' : 'text-primary-100'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    <FaRobot />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="p-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply.text)}
                    className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                  >
                    <reply.icon className="mr-1" />
                    {reply.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;