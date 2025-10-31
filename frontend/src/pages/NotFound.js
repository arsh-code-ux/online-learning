import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-primary-600 text-4xl" />
          </div>
          <h1 className="text-6xl font-bold text-gray-300 mb-2">404</h1>
          <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
        </div>

        {/* Description */}
        <div className="mb-8">
          <p className="text-gray-600 text-lg mb-4">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500 text-sm">
            Don't worry, it happens to the best of us. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary w-full flex items-center justify-center"
          >
            <FaHome className="mr-2" />
            Go Back Home
          </Link>
          
          <Link
            to="/courses"
            className="btn-outline w-full flex items-center justify-center"
          >
            <FaSearch className="mr-2" />
            Browse Courses
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-4">You might be looking for:</p>
          <div className="space-y-2">
            <Link to="/courses" className="block text-primary-600 hover:text-primary-700 text-sm">
              Course Catalog
            </Link>
            <Link to="/about" className="block text-primary-600 hover:text-primary-700 text-sm">
              About Us
            </Link>
            <Link to="/contact" className="block text-primary-600 hover:text-primary-700 text-sm">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;