import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaKey, FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';

// Admin Passkey - Must match AdminLogin
const ADMIN_PASSKEY = 'LMS@Admin2024#Secure';

const AdminSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminPasskey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.adminPasskey !== ADMIN_PASSKEY) {
      toast.error('Invalid Admin Passkey! Access Denied.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Check if email is blocked
    const blockedEmails = JSON.parse(localStorage.getItem('blockedAdminEmails') || '[]');
    if (blockedEmails.includes(formData.email)) {
      toast.error('❌ This email has been permanently blocked from admin access due to security violations!');
      setLoading(false);
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.email === formData.email);

    if (existingUser) {
      toast.error('Email already registered!');
      setLoading(false);
      return;
    }

    // Create new admin user
    const newAdmin = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password, // In production, hash this!
      role: 'admin',
      createdAt: new Date().toISOString(),
      profileImage: null
    };

    // Save to localStorage
    users.push(newAdmin);
    localStorage.setItem('users', JSON.stringify(users));

    // Login automatically
    login(newAdmin);
    localStorage.setItem('user', JSON.stringify(newAdmin));
    
    toast.success('Admin account created successfully! Welcome aboard.');
    navigate('/admin/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
              <FaShieldAlt className="text-white text-4xl" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Create Admin Account
          </h2>
          <p className="text-blue-200 text-lg">
            Register as Administrator
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Admin Passkey - First for security */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                <FaKey className="inline mr-2" />
                Admin Passkey *
              </label>
              <div className="relative">
                <input
                  type={showPasskey ? 'text' : 'password'}
                  name="adminPasskey"
                  value={formData.adminPasskey}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  placeholder="Enter Admin Passkey"
                />
                <button
                  type="button"
                  onClick={() => setShowPasskey(!showPasskey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showPasskey ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="text-xs text-yellow-300 mt-1">
                🔒 Contact administrator for passkey
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                <FaUser className="inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                <FaEnvelope className="inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="admin@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                <FaLock className="inline mr-2" />
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                <FaLock className="inline mr-2" />
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 rounded-lg font-bold text-lg hover:from-green-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-blue-200">
              Already have an admin account?{' '}
              <Link to="/admin/login" className="text-green-400 hover:text-green-300 font-semibold">
                Login Here
              </Link>
            </p>
            <Link to="/register" className="block text-sm text-gray-300 hover:text-white">
              ← Register as Student Instead
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-red-200 text-sm">
            ⚠️ <strong>Admin Access Only:</strong> Unauthorized registration is prohibited
          </p>
          <p className="text-red-300 text-xs mt-1">
            Valid admin passkey required for account creation
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
