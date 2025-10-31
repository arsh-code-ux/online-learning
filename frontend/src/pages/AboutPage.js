import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, 
  FaLightbulb, 
  FaBullseye, 
  FaHeart,
  FaGraduationCap,
  FaCertificate,
  FaChartLine,
  FaRocket,
  FaGlobe
} from 'react-icons/fa';

const AboutPage = () => {
  useEffect(() => {
    // Add about page styles
    const aboutStyles = document.createElement('style');
    aboutStyles.textContent = `
      .about-page {
        position: relative;
        overflow-x: hidden;
      }

      .hero-background {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        overflow: hidden;
      }

      .hero-background::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E");
        animation: movePattern 20s linear infinite;
      }

      @keyframes movePattern {
        0% { transform: translateX(0); }
        100% { transform: translateX(60px); }
      }

      .floating-elements {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .floating-element {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: floatUpDown 6s ease-in-out infinite;
      }

      .floating-element:nth-child(1) {
        width: 100px;
        height: 100px;
        top: 10%;
        left: 10%;
        animation-delay: 0s;
      }

      .floating-element:nth-child(2) {
        width: 60px;
        height: 60px;
        top: 70%;
        right: 10%;
        animation-delay: 2s;
      }

      .floating-element:nth-child(3) {
        width: 80px;
        height: 80px;
        top: 40%;
        left: 80%;
        animation-delay: 4s;
      }

      @keyframes floatUpDown {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(180deg); }
      }

      .hero-content {
        animation: fadeInUp 1s ease-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .section-animate {
        animation: slideInView 0.8s ease-out;
      }

      @keyframes slideInView {
        from {
          opacity: 0;
          transform: translateY(40px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .stat-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
        transition: left 0.6s ease;
      }

      .stat-card:hover::before {
        left: 100%;
      }

      .stat-card:hover {
        transform: translateY(-10px) scale(1.05);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      .value-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 24px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .value-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .value-card:hover::after {
        opacity: 1;
      }

      .value-card:hover {
        transform: translateY(-12px);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
      }

      .value-icon {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transition: all 0.3s ease;
      }

      .value-card:hover .value-icon {
        transform: scale(1.1) rotate(10deg);
      }

      .team-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 24px;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      }

      .team-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
      }

      .team-avatar {
        transition: all 0.3s ease;
        position: relative;
      }

      .team-avatar::after {
        content: '';
        position: absolute;
        inset: -3px;
        background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
        border-radius: 50%;
        z-index: -1;
        animation: rotate 3s linear infinite;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .team-card:hover .team-avatar::after {
        opacity: 1;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .cta-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        overflow: hidden;
      }

      .cta-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      }

      .cta-button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .cta-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s ease;
      }

      .cta-button:hover::before {
        left: 100%;
      }

      .cta-button:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      }

      .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .counter-animation {
        display: inline-block;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .mission-section {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
        position: relative;
      }

      .mission-section::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23667eea' fill-opacity='0.03'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E");
      }

      .values-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
      }

      .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
      }

      .animate-on-scroll.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(aboutStyles);

    return () => {
      document.head.removeChild(aboutStyles);
    };
  }, []);

  return (
    <div className="min-h-screen about-page bg-white">
      {/* Hero Section */}
      <section className="hero-background py-24 px-4 text-white relative">
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center hero-content relative z-10">
          <div className="mb-8">
            <FaRocket className="text-6xl mx-auto mb-6 animate-bounce" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8">
            About <span className="text-yellow-300">LearnHub</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 leading-relaxed max-w-4xl mx-auto mb-8">
            We're on a mission to democratize education and empower learners worldwide with the skills 
            they need to succeed in today's rapidly evolving digital landscape.
          </p>
          <div className="flex items-center justify-center space-x-4 text-blue-200">
            <FaGlobe className="text-2xl animate-pulse" />
            <span className="text-lg font-medium">Transforming Lives Through Learning</span>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="section-animate">
              <h2 className="text-5xl font-bold text-gray-900 mb-8">
                Our <span className="gradient-text">Mission</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                At LearnHub, we believe that education should be accessible, engaging, and relevant to 
                everyone. Our platform brings together expert instructors and cutting-edge technology 
                to deliver world-class learning experiences.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                Whether you're looking to advance your career, learn new skills, or pursue personal 
                interests, we provide the tools and resources you need to achieve your goals.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="stat-card p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaUsers className="text-white text-3xl" />
                </div>
                <h3 className="counter-animation text-3xl mb-2">10,000+</h3>
                <p className="text-gray-600 font-medium">Active Learners</p>
              </div>
              <div className="stat-card p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaGraduationCap className="text-white text-3xl" />
                </div>
                <h3 className="counter-animation text-3xl mb-2">50+</h3>
                <p className="text-gray-600 font-medium">Expert Courses</p>
              </div>
              <div className="stat-card p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaCertificate className="text-white text-3xl" />
                </div>
                <h3 className="counter-animation text-3xl mb-2">5,000+</h3>
                <p className="text-gray-600 font-medium">Certificates Issued</p>
              </div>
              <div className="stat-card p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FaChartLine className="text-white text-3xl" />
                </div>
                <h3 className="counter-animation text-3xl mb-2">95%</h3>
                <p className="text-gray-600 font-medium">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Our <span className="gradient-text">Values</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              These core principles guide everything we do and shape the learning experience we provide to learners worldwide.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card p-10 text-center">
              <div className="value-icon w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <FaLightbulb className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Innovation</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                We constantly evolve our platform and teaching methods to provide the most effective 
                and engaging learning experiences for the digital age.
              </p>
            </div>

            <div className="value-card p-10 text-center">
              <div className="value-icon w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <FaUsers className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Community</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Learning is better together. We foster a supportive community where learners 
                can connect, collaborate, and grow alongside each other.
              </p>
            </div>

            <div className="value-card p-10 text-center">
              <div className="value-icon w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <FaBullseye className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Excellence</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                We maintain the highest standards in course quality, instructor expertise, 
                and student support services to ensure outstanding outcomes.
              </p>
            </div>

            <div className="value-card p-10 text-center">
              <div className="value-icon w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <FaHeart className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Passion</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                We're passionate about education and dedicated to helping every learner 
                achieve their full potential and pursue their dreams.
              </p>
            </div>

            <div className="value-card p-10 text-center">
              <div className="value-icon w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <FaGraduationCap className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Accessibility</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Quality education should be accessible to everyone, regardless of background, 
                location, or financial situation.
              </p>
            </div>

            <div className="value-card p-10 text-center">
              <div className="value-icon w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <FaChartLine className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Growth</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                We believe in continuous learning and growth, both for our learners 
                and our organization, embracing change and improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Our diverse team of educators, technologists, and innovators work together to create 
              exceptional learning experiences that transform lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Team Member 1 */}
            <div className="team-card p-10 text-center">
              <div className="team-avatar w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <span className="text-white text-3xl font-bold">JD</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">John Doe</h3>
              <p className="text-blue-600 font-semibold text-lg mb-6">CEO & Founder</p>
              <p className="text-gray-600 leading-relaxed">
                Passionate about democratizing education with over 15 years of experience in EdTech 
                and a vision for accessible learning.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="team-card p-10 text-center">
              <div className="team-avatar w-32 h-32 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <span className="text-white text-3xl font-bold">JS</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Jane Smith</h3>
              <p className="text-blue-600 font-semibold text-lg mb-6">Head of Content</p>
              <p className="text-gray-600 leading-relaxed">
                Curriculum expert ensuring our courses meet the highest educational standards 
                and deliver real-world value to learners.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="team-card p-10 text-center">
              <div className="team-avatar w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <span className="text-white text-3xl font-bold">MJ</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Mike Johnson</h3>
              <p className="text-blue-600 font-semibold text-lg mb-6">CTO</p>
              <p className="text-gray-600 leading-relaxed">
                Technology leader building scalable platforms for millions of learners worldwide, 
                focusing on innovation and user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-24 px-4 text-white relative">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <FaRocket className="text-5xl mx-auto mb-6 animate-pulse" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8">Ready to Start Learning?</h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join our community of learners and take the first step towards achieving your goals. 
            Your journey to success starts here!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/register" 
              className="cta-button bg-white text-blue-600 font-bold py-5 px-10 rounded-xl text-lg shadow-xl"
            >
              Get Started Free
            </Link>
            <Link 
              to="/courses" 
              className="cta-button border-3 border-white text-white font-bold py-5 px-10 rounded-xl text-lg"
            >
              Explore Courses
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2">Free</div>
              <div className="text-blue-200">Trial Access</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Support Available</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold mb-2">Lifetime</div>
              <div className="text-blue-200">Certificate Access</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;