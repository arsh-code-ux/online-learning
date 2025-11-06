import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaKey, FaShieldAlt, FaUserGraduate, FaGoogle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Register.css';

// Admin Passkey - Must match AdminLogin
const ADMIN_PASSKEY = 'LMS@Admin2024#Secure';

const Register = () => {
  const navigate = useNavigate();
  const { register, googleLogin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    adminPasskey: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Check if admin role is selected and validate passkey
    if (formData.role === 'admin') {
      // Check if email is blocked
      const blockedEmails = JSON.parse(localStorage.getItem('blockedAdminEmails') || '[]');
      if (blockedEmails.includes(formData.email)) {
        toast.error('❌ This email has been permanently blocked from admin access!');
        return;
      }

      // Validate admin passkey
      if (formData.adminPasskey !== ADMIN_PASSKEY) {
        toast.error('❌ Invalid Admin Passkey! Cannot register as admin.');
        return;
      }
    }

    setLoading(true);

    try {
      const { confirmPassword, adminPasskey, ...registerData } = formData;
      await register(registerData);
      
      if (formData.role === 'admin') {
        toast.success('🎉 Admin registration successful! Please sign in.');
      } else {
        toast.success('Registration successful! Please sign in.');
      }
      
      navigate('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      {/* Animated Background */}
      <div className="register-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Register Card */}
      <div className="register-container">
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <div className="logo-container">
              <div className="logo-icon">
                <FaUserGraduate className="text-4xl text-blue-600" />
              </div>
            </div>
            <h1 className="register-title">Create Account 🚀</h1>
            <p className="register-subtitle">Start your learning journey today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* Name Field */}
            <div className="form-group">
              <label className="form-label">
                <FaUser className="label-icon" />
                Full Name
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                <FaEnvelope className="label-icon" />
                Email Address
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Role Selector */}
            <div className="form-group">
              <label className="form-label">
                {formData.role === 'admin' ? <FaShieldAlt className="label-icon" /> : <FaUserGraduate className="label-icon" />}
                I want to join as
              </label>
              <div className="input-wrapper">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Admin Passkey Field (Conditional) */}
            {formData.role === 'admin' && (
              <div className="form-group admin-passkey-section">
                <label className="form-label">
                  <FaKey className="label-icon" />
                  Admin Passkey
                </label>
                <div className="admin-warning-box">
                  <FaShieldAlt className="warning-icon" />
                  <div>
                    <p className="warning-title">🔒 Admin Verification Required</p>
                    <p className="warning-text">You need a special passkey to register as admin. Contact the administrator if you don't have one.</p>
                  </div>
                </div>
                <div className="input-wrapper password-wrapper">
                  <input
                    type={showPasskey ? 'text' : 'password'}
                    name="adminPasskey"
                    value={formData.adminPasskey}
                    onChange={handleChange}
                    className="form-input passkey-input"
                    placeholder="Enter admin passkey"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasskey(!showPasskey)}
                    className="password-toggle"
                  >
                    {showPasskey ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">
                <FaLock className="label-icon" />
                Password
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p className="input-hint">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label className="form-label">
                <FaLock className="label-icon" />
                Confirm Password
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>Or continue with</span>
          </div>

          {/* Google Register */}
          <button disabled className="google-btn disabled">
            <FaGoogle className="mr-2" />
            Continue with Google (Coming Soon)
          </button>

          {/* Footer Links */}
          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign in here
              </Link>
            </p>
            <Link to="/" className="home-link">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
