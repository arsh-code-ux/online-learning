import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
  };

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center space-y-3">
      <FaSpinner 
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
      />
      {text && (
        <p className={`text-sm ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Spinner />
    </div>
  );
};

export default LoadingSpinner;