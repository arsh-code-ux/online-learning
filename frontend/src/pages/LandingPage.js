import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaPlay, 
  FaStar, 
  FaCertificate, 
  FaUsers, 
  FaBook, 
  FaChartLine,
  FaBrain,
  FaCode,
  FaLightbulb,
  FaQuoteLeft,
  FaCheckCircle
} from 'react-icons/fa';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Master New 
                  <span className="gradient-text"> Skills</span>
                  <br />
                  Shape Your Future
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Join thousands of learners advancing their careers with our comprehensive online courses in soft skills, technical expertise, and analytical thinking.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="btn-primary">
                  <FaBook className="mr-2" />
                  Explore Courses
                  <FaArrowRight className="ml-2" />
                </Link>
                <button className="btn-outline">
                  <FaPlay className="mr-2" />
                  Watch Demo
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">10K+</div>
                  <div className="text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">50+</div>
                  <div className="text-gray-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">95%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative animate-slide-up animation-delay-200">
              <div className="glass rounded-2xl p-8 bg-white/20 backdrop-blur-md">
                <div className="space-y-6">
                  {/* Mock Course Card */}
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
                        <FaCode className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">JavaScript Fundamentals</h3>
                        <p className="text-gray-600 text-sm">Technical Skills</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">$49</div>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 text-sm" />
                          <span className="text-sm text-gray-600 ml-1">4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-700 font-medium">Communication Skills</span>
                      <span className="text-primary-600 font-semibold">75%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  {/* Achievement Badge */}
                  <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-center space-x-3">
                      <FaCertificate className="text-2xl" />
                      <div>
                        <div className="font-semibold">Course Complete!</div>
                        <div className="text-green-100 text-sm">Data Analysis Basics</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose LearnHub?
            </h2>
            <div className="section-divider mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing high-quality, accessible education that empowers learners to achieve their goals and advance their careers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from industry professionals with years of real-world experience and expertise.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCertificate className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Verified Certificates</h3>
              <p className="text-gray-600">
                Earn industry-recognized certificates that you can share on LinkedIn and your resume.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaChartLine className="text-purple-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed analytics and personalized recommendations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBook className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Rich Content</h3>
              <p className="text-gray-600">
                Access video lectures, interactive quizzes, and downloadable resources for comprehensive learning.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLightbulb className="text-yellow-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Practical Learning</h3>
              <p className="text-gray-600">
                Apply your knowledge with hands-on projects and real-world case studies.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBrain className="text-red-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI-Powered</h3>
              <p className="text-gray-600">
                Get instant help and answers to your questions with our intelligent chatbot assistant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Our Course Categories
            </h2>
            <div className="section-divider mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from three comprehensive skill categories designed to boost your career and personal development.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Soft Skills */}
            <div className="course-card">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <FaUsers className="text-white text-6xl" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Soft Skills</h3>
                <p className="text-gray-600 mb-6">
                  Develop communication, leadership, teamwork, and interpersonal skills essential for professional success.
                </p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Communication & Presentation
                  </li>
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Leadership & Management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Time Management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Emotional Intelligence
                  </li>
                </ul>
                <Link 
                  to="/courses?category=Soft Skills"
                  className="btn-primary w-full text-center"
                >
                  Explore Soft Skills
                </Link>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="course-card">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <FaCode className="text-white text-6xl" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Technical Skills</h3>
                <p className="text-gray-600 mb-6">
                  Master programming, web development, databases, and other technical competencies in high demand.
                </p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Web Development
                  </li>
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Programming Languages
                  </li>
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Database Management
                  </li>
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Cloud Computing
                  </li>
                </ul>
                <Link 
                  to="/courses?category=Technical Skills"
                  className="btn-primary w-full text-center"
                >
                  Explore Technical Skills
                </Link>
              </div>
            </div>

            {/* Analytical Skills */}
            <div className="course-card">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <FaChartLine className="text-white text-6xl" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytical Skills</h3>
                <p className="text-gray-600 mb-6">
                  Learn data analysis, critical thinking, problem-solving, and decision-making skills for data-driven insights.
                </p>
                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Data Analysis & Visualization
                  </li>
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Statistical Analysis
                  </li>
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Critical Thinking
                  </li>
                  <li className="flex items-center text-gray-700">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Problem Solving
                  </li>
                </ul>
                <Link 
                  to="/courses?category=Analytical Skills"
                  className="btn-primary w-full text-center"
                >
                  Explore Analytical Skills
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Effective Learning
            </h2>
            <div className="section-divider mb-6"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Features List */}
            <div className="space-y-8">
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaPlay className="text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">HD Video Lectures</h3>
                  <p className="text-gray-600">
                    Crystal clear video content with subtitles and multiple quality options for optimal learning experience.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle className="text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Assessments</h3>
                  <p className="text-gray-600">
                    Test your knowledge with quizzes, assignments, and projects that reinforce your learning.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaCertificate className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Certificates</h3>
                  <p className="text-gray-600">
                    Earn verifiable certificates that showcase your skills to employers and enhance your career prospects.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaBrain className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Chatbot Support</h3>
                  <p className="text-gray-600">
                    Get instant answers to your questions with our intelligent AI assistant available 24/7.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature Image */}
            <div className="relative">
              <div className="glass rounded-2xl p-8 bg-gradient-to-br from-primary-50 to-purple-50">
                <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Course Progress</h4>
                    <span className="badge badge-primary">85%</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Module 1: Introduction</span>
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Module 2: Fundamentals</span>
                      <FaCheckCircle className="text-green-500" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Module 3: Advanced Topics</span>
                      <div className="w-4 h-4 border-2 border-primary-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h4 className="font-semibold mb-4">AI Assistant</h4>
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-600">"How do I complete the assignment?"</p>
                  </div>
                  <div className="bg-primary-500 text-white rounded-lg p-3">
                    <p className="text-sm">Great question! You can find the assignment in Module 3. Here are the steps...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <div className="section-divider mb-6"></div>
            <p className="text-xl text-gray-600">
              Join thousands of successful learners who have transformed their careers with LearnHub.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="card p-8">
              <FaQuoteLeft className="text-primary-400 text-2xl mb-4" />
              <p className="text-gray-600 mb-6 italic">
                "LearnHub's courses helped me transition into a tech role. The practical projects and expert guidance made all the difference in my career."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  SM
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Sarah Martinez</div>
                  <div className="text-gray-600 text-sm">Software Developer</div>
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="card p-8">
              <FaQuoteLeft className="text-primary-400 text-2xl mb-4" />
              <p className="text-gray-600 mb-6 italic">
                "The communication skills course transformed how I present ideas to my team. The confidence I gained is invaluable for my leadership role."
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  MJ
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Michael Johnson</div>
                  <div className="text-gray-600 text-sm">Team Lead</div>
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="card p-8">
              <FaQuoteLeft className="text-primary-400 text-2xl mb-4" />
              <p className="text-gray-600 mb-6 italic">
                "The data analysis course gave me the skills to make data-driven decisions. I got promoted within 3 months of completing the program!"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  EC
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Emily Chen</div>
                  <div className="text-gray-600 text-sm">Data Analyst</div>
                  <div className="flex text-yellow-400">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join over 10,000 students who are already advancing their careers with LearnHub. 
            Start with our free courses or unlock premium content today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              Get Started Free
            </Link>
            <Link 
              to="/courses" 
              className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-primary-600 transform hover:scale-105 transition-all duration-300"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;