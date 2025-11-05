import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaHome, 
  FaBook, 
  FaUser, 
  FaSignInAlt, 
  FaUserPlus, 
  FaSignOutAlt,
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaCog,
  FaShieldAlt
} from 'react-icons/fa';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-3xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            onClick={closeMobileMenu}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
              <FaBook className="text-white text-xl" />
            </div>
            <span>LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`nav-link text-lg ${isActivePath('/') && location.pathname === '/' ? 'nav-link-active' : ''}`}
            >
              <FaHome className="inline mr-1" />
              Home
            </Link>
            
            <Link 
              to="/courses" 
              className={`nav-link text-lg ${isActivePath('/courses') ? 'nav-link-active' : ''}`}
            >
              <FaBook className="inline mr-1" />
              Courses
            </Link>
            
            <Link 
              to="/about" 
              className={`nav-link text-lg ${isActivePath('/about') ? 'nav-link-active' : ''}`}
            >
              About
            </Link>
            
            <Link 
              to="/contact" 
              className={`nav-link text-lg ${isActivePath('/contact') ? 'nav-link-active' : ''}`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop Auth Links */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`nav-link text-lg ${isActivePath('/dashboard') ? 'nav-link-active' : ''}`}
                >
                  <FaTachometerAlt className="inline mr-1" />
                  Dashboard
                </Link>
                
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className={`nav-link ${isActivePath('/admin') ? 'nav-link-active' : ''}`}
                  >
                    <FaShieldAlt className="inline mr-1" />
                    Admin
                  </Link>
                )}
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 nav-link">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                    </div>
                    <span>{user?.firstName || user?.username}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaUser className="inline mr-2" />
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FaCog className="inline mr-2" />
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="nav-link"
                >
                  <FaSignInAlt className="inline mr-1" />
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  <FaUserPlus className="inline mr-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActivePath('/') && location.pathname === '/' 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={closeMobileMenu}
            >
              <FaHome className="inline mr-2" />
              Home
            </Link>
            
            <Link 
              to="/courses" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActivePath('/courses') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={closeMobileMenu}
            >
              <FaBook className="inline mr-2" />
              Courses
            </Link>
            
            <Link 
              to="/about" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActivePath('/about') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={closeMobileMenu}
            >
              About
            </Link>
            
            <Link 
              to="/contact" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActivePath('/contact') 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
              }`}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <hr className="my-2" />
                <Link 
                  to="/dashboard" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActivePath('/dashboard') 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <FaTachometerAlt className="inline mr-2" />
                  Dashboard
                </Link>
                
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActivePath('/admin') 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <FaShieldAlt className="inline mr-2" />
                    Admin
                  </Link>
                )}
                
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  <FaUser className="inline mr-2" />
                  Profile
                </Link>
                
                <Link 
                  to="/settings" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  <FaCog className="inline mr-2" />
                  Settings
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <FaSignOutAlt className="inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <hr className="my-2" />
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary-600 hover:bg-gray-50"
                  onClick={closeMobileMenu}
                >
                  <FaSignInAlt className="inline mr-2" />
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 mx-3"
                  onClick={closeMobileMenu}
                >
                  <FaUserPlus className="inline mr-2" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;