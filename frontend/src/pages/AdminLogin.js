import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaKey, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

// Admin Passkey - Change this for production
const ADMIN_PASSKEY = 'LMS@Admin2024#Secure';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminPasskey: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate admin passkey first
    if (formData.adminPasskey !== ADMIN_PASSKEY) {
      toast.error('Invalid Admin Passkey! Access Denied.');
      setLoading(false);
      return;
    }

    // Check if admin exists in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminUser = users.find(u => u.email === formData.email && u.role === 'admin');

    if (!adminUser) {
      toast.error('Admin account not found. Please signup first.');
      setLoading(false);
      return;
    }

    // For demo, simple password check (in production, use proper hashing)
    if (adminUser.password !== formData.password) {
      toast.error('Invalid password!');
      setLoading(false);
      return;
    }

    // Login successful
    login(adminUser);
    localStorage.setItem('user', JSON.stringify(adminUser));
    toast.success('Admin login successful! Welcome back.');
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
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <FaShieldAlt className="text-white text-4xl" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">
            Admin Portal
          </h2>
          <p className="text-blue-200 text-lg">
            Secure Administrator Access
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Admin Passkey */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                <FaKey className="inline mr-2" />
                Admin Passkey
              </label>
              <div className="relative">
                <input
                  type={showPasskey ? 'text' : 'password'}
                  name="adminPasskey"
                  value={formData.adminPasskey}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
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
                🔒 Required for admin access only
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                <FaUser className="inline mr-2" />
                Email Address
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
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-3 rounded-lg font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
            >
              {loading ? 'Verifying...' : 'Login as Admin'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-blue-200">
              Don't have an admin account?{' '}
              <Link to="/admin/signup" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                Create Admin Account
              </Link>
            </p>
            <Link to="/login" className="block text-sm text-gray-300 hover:text-white">
              ← Back to Student Login
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
          <p className="text-yellow-200 text-sm">
            🔐 <strong>Secure Access:</strong> Admin passkey required for authentication
          </p>
          <p className="text-yellow-300 text-xs mt-1">
            Contact system administrator if you don't have the passkey
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
