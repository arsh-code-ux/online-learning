import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white hover:text-primary-400 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FaBook className="text-white text-sm" />
              </div>
              <span>LearnHub</span>
            </Link>
            <p className="text-gray-300 leading-relaxed">
              Empowering learners worldwide with comprehensive online courses in soft skills, technical skills, and analytical thinking.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com/lms-platform" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a 
                href="https://twitter.com/lms-platform" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a 
                href="https://linkedin.com/company/lms-platform" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a 
                href="https://instagram.com/lms-platform" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Join Now
                </Link>
              </li>
            </ul>
          </div>

          {/* Course Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Course Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/courses?category=Soft Skills" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Soft Skills
                </Link>
              </li>
              <li>
                <Link 
                  to="/courses?category=Technical Skills" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Technical Skills
                </Link>
              </li>
              <li>
                <Link 
                  to="/courses?category=Analytical Skills" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Analytical Skills
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-gray-300 hover:text-primary-400 transition-colors">
                  View All Courses
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400 flex-shrink-0" />
                <a 
                  href="mailto:support@learnhub.com" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  support@learnhub.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaPhone className="text-primary-400 flex-shrink-0" />
                <a 
                  href="tel:+1234567890" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">
                  123 Learning Street<br />
                  Education City, EC 12345<br />
                  United States
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-300 text-sm flex items-center">
              <span>&copy; {currentYear} LearnHub. All rights reserved.</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                Made with <FaHeart className="text-red-500 mx-1" size={12} /> for learners
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-300 hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-300 hover:text-primary-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;