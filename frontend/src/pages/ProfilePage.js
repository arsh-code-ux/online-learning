import React, { useState, useContext, useEffect } from 'react';
import { 
  FaUser, 
  FaLock, 
  FaCamera,
  FaSave,
  FaBell,
  FaShieldAlt,
  FaTrash,
  FaGraduationCap,
  FaCertificate,
  FaTrophy,
  FaCalendar,
  FaClock,
  FaStar
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    courseUpdates: true,
    marketingEmails: false,
    pushNotifications: true
  });

  useEffect(() => {
    // Add profile page styles
    const profileStyles = document.createElement('style');
    profileStyles.textContent = `
      .profile-page {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        overflow: hidden;
      }

      .profile-page::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        pointer-events: none;
      }

      .floating-shape {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: float 6s ease-in-out infinite;
      }

      .floating-shape:nth-child(1) {
        width: 80px;
        height: 80px;
        top: 10%;
        left: 10%;
        animation-delay: 0s;
      }

      .floating-shape:nth-child(2) {
        width: 120px;
        height: 120px;
        top: 20%;
        right: 10%;
        animation-delay: 2s;
      }

      .floating-shape:nth-child(3) {
        width: 60px;
        height: 60px;
        bottom: 20%;
        left: 15%;
        animation-delay: 4s;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
      }

      .profile-header {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        animation: slideDown 0.8s ease-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .profile-content {
        animation: fadeInUp 1s ease-out 0.3s both;
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

      .profile-nav-item {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .profile-nav-item::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
        transition: left 0.6s ease;
      }

      .profile-nav-item.active::before {
        left: 100%;
      }

      .profile-nav-item:hover {
        transform: translateX(5px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }

      .profile-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .profile-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 35px 60px rgba(0, 0, 0, 0.15);
      }

      .achievement-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .achievement-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        transition: left 0.6s ease;
      }

      .achievement-card:hover::before {
        left: 100%;
      }

      .achievement-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        padding: 1.5rem;
        transition: all 0.3s ease;
        animation: slideInScale 0.6s ease-out forwards;
        opacity: 0;
        transform: scale(0.9) translateY(20px);
      }

      .stat-card:nth-child(1) { animation-delay: 0.1s; }
      .stat-card:nth-child(2) { animation-delay: 0.2s; }
      .stat-card:nth-child(3) { animation-delay: 0.3s; }

      @keyframes slideInScale {
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      .stat-card:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
      }

      .progress-bar {
        position: relative;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        height: 8px;
        overflow: hidden;
      }

      .progress-fill {
        height: 100%;
        border-radius: 10px;
        position: relative;
        transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .progress-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: shimmer 2s infinite;
      }

      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      .profile-avatar {
        position: relative;
        transition: all 0.3s ease;
      }

      .profile-avatar:hover {
        transform: scale(1.05);
      }

      .profile-avatar::after {
        content: '';
        position: absolute;
        inset: -4px;
        background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
        border-radius: 50%;
        z-index: -1;
        animation: rotate 3s linear infinite;
      }

      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      .input-group {
        position: relative;
      }

      .input-enhanced {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid rgba(102, 126, 234, 0.1);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.9);
        transition: all 0.3s ease;
        font-size: 16px;
      }

      .input-enhanced:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        background: rgba(255, 255, 255, 1);
        transform: translateY(-2px);
      }

      .button-enhanced {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        padding: 12px 24px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .button-enhanced::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s ease;
      }

      .button-enhanced:hover::before {
        left: 100%;
      }

      .button-enhanced:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
      }

      .toggle-switch {
        position: relative;
        width: 44px;
        height: 24px;
        background: #e5e7eb;
        border-radius: 12px;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .toggle-switch.active {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .toggle-switch::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .toggle-switch.active::after {
        transform: translateX(20px);
      }

      .tab-content {
        animation: fadeInSlide 0.5s ease-out;
      }

      @keyframes fadeInSlide {
        from {
          opacity: 0;
          transform: translateX(20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }

      .notification-item {
        padding: 1rem;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.3);
        transition: all 0.3s ease;
        margin-bottom: 1rem;
      }

      .notification-item:hover {
        background: rgba(255, 255, 255, 0.8);
        transform: translateX(5px);
      }
    `;
    document.head.appendChild(profileStyles);

    return () => {
      document.head.removeChild(profileStyles);
    };
  }, []);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: FaUser },
    { id: 'security', name: 'Security', icon: FaShieldAlt },
    { id: 'notifications', name: 'Notifications', icon: FaBell },
    { id: 'achievements', name: 'Achievements', icon: FaTrophy }
  ];

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (setting) => {
    setNotifications({
      ...notifications,
      [setting]: !notifications[setting]
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate password update
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Picture */}
      <div className="flex items-center space-x-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
        <div className="profile-avatar">
          <img
            src={`https://ui-avatars.com/api/?name=${user?.name}&size=120&background=667eea&color=ffffff`}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          <button className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-full hover:scale-110 transition-all duration-300 shadow-lg">
            <FaCamera className="text-lg" />
          </button>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            {user?.name}
          </h3>
          <p className="text-lg text-gray-600 capitalize font-medium">{user?.role} Member</p>
          <p className="text-sm text-gray-500 mt-2 flex items-center">
            <FaCalendar className="mr-2" />
            Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="input-group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              className="input-enhanced"
              required
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              className="input-enhanced"
              required
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              className="input-enhanced"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={profileData.location}
              onChange={handleProfileChange}
              className="input-enhanced"
              placeholder="City, Country"
            />
          </div>

          <div className="input-group md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={profileData.website}
              onChange={handleProfileChange}
              className="input-enhanced"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <div className="input-group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Bio
          </label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleProfileChange}
            rows={4}
            className="input-enhanced resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="button-enhanced disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <FaSave className="mr-3" />
                Save Changes
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-8">
      {/* Change Password */}
      <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaLock className="mr-3 text-red-500" />
          Change Password
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="input-group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="input-enhanced"
              required
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="input-enhanced"
              minLength={6}
              required
            />
          </div>

          <div className="input-group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="input-enhanced"
              minLength={6}
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="button-enhanced disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                  Updating...
                </div>
              ) : (
                <div className="flex items-center">
                  <FaLock className="mr-3" />
                  Update Password
                </div>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaShieldAlt className="mr-3 text-green-500" />
          Two-Factor Authentication
        </h3>
        <div className="achievement-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Enhanced Security</h4>
              <p className="text-gray-600">
                Add an extra layer of security to your account with 2FA authentication
              </p>
            </div>
            <button className="button-enhanced ml-6">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl">
        <h3 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
          <FaTrash className="mr-3" />
          Danger Zone
        </h3>
        <div className="achievement-card p-6 border-2 border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-red-900 mb-2">Delete Account</h4>
              <p className="text-red-700">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 ml-6">
              <FaTrash className="mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Notification Preferences
        </h3>
        <p className="text-gray-600 text-lg">
          Customize how you want to receive updates and notifications
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries({
          emailNotifications: 'Email Notifications',
          courseUpdates: 'Course Updates',
          marketingEmails: 'Marketing Emails',
          pushNotifications: 'Push Notifications'
        }).map(([key, label]) => (
          <div key={key} className="notification-item">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{label}</h4>
                <p className="text-gray-600">
                  {key === 'emailNotifications' && 'Receive important updates and announcements via email'}
                  {key === 'courseUpdates' && 'Get notified about course progress, new content, and deadlines'}
                  {key === 'marketingEmails' && 'Receive promotional offers, course recommendations, and special deals'}
                  {key === 'pushNotifications' && 'Get real-time notifications directly in your browser'}
                </p>
              </div>
              <div 
                className={`toggle-switch ${notifications[key] ? 'active' : ''}`}
                onClick={() => handleNotificationChange(key)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-6">
        <button className="button-enhanced">
          <FaSave className="mr-3" />
          Save Preferences
        </button>
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-4">
          Your Achievements
        </h3>
        <p className="text-gray-600 text-lg">
          Track your learning journey and celebrate your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Courses Completed</p>
              <p className="text-3xl font-bold">12</p>
              <p className="text-blue-200 text-xs mt-1">+3 this month</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FaGraduationCap className="text-3xl" />
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium mb-1">Certificates Earned</p>
              <p className="text-3xl font-bold">8</p>
              <p className="text-yellow-200 text-xs mt-1">+2 this week</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FaCertificate className="text-3xl" />
            </div>
          </div>
        </div>

        <div className="stat-card bg-gradient-to-br from-green-500 via-green-600 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Learning Streak</p>
              <p className="text-3xl font-bold">15</p>
              <p className="text-green-200 text-xs mt-1">days in a row</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FaClock className="text-3xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaTrophy className="mr-3 text-yellow-500" />
          Recent Achievements
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: FaCertificate,
              title: 'Course Master',
              description: 'Completed 10+ courses with excellence',
              date: '2 days ago',
              color: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white'
            },
            {
              icon: FaTrophy,
              title: 'Quick Learner',
              description: 'Finished a course in under 24 hours',
              date: '1 week ago',
              color: 'bg-gradient-to-br from-orange-400 to-red-500 text-white'
            },
            {
              icon: FaStar,
              title: 'Perfect Score',
              description: 'Scored 100% on final assessment',
              date: '2 weeks ago',
              color: 'bg-gradient-to-br from-purple-400 to-pink-500 text-white'
            },
            {
              icon: FaCalendar,
              title: 'Consistency Champion',
              description: 'Maintained 30-day learning streak',
              date: '1 month ago',
              color: 'bg-gradient-to-br from-green-400 to-teal-500 text-white'
            }
          ].map((achievement, index) => (
            <div key={index} className="achievement-card p-6 flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${achievement.color} shadow-lg`}>
                <achievement.icon className="text-2xl" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 mb-1">{achievement.title}</h4>
                <p className="text-gray-600 mb-2">{achievement.description}</p>
                <p className="text-sm text-gray-500 flex items-center">
                  <FaClock className="mr-1" />
                  {achievement.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Progress */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <FaGraduationCap className="mr-3 text-blue-500" />
          Learning Progress
        </h3>
        <div className="space-y-6">
          {[
            { skill: 'Soft Skills', progress: 85, color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
            { skill: 'Technical Skills', progress: 72, color: 'bg-gradient-to-r from-green-500 to-teal-500' },
            { skill: 'Analytical Skills', progress: 68, color: 'bg-gradient-to-r from-purple-500 to-pink-500' }
          ].map((skill, index) => (
            <div key={index} className="achievement-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-gray-900">{skill.skill}</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                  {skill.progress}%
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${skill.color}`}
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
              <div className="mt-3 text-sm text-gray-600">
                {skill.progress >= 80 ? 'Excellent progress!' : 
                 skill.progress >= 60 ? 'Good progress, keep going!' : 
                 'Just getting started, you can do it!'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen profile-page">
      {/* Floating Background Shapes */}
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>

      {/* Header */}
      <div className="profile-header px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Profile Settings
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your account settings, security preferences, and track your learning journey
          </p>
        </div>
      </div>

      <div className="profile-content py-8 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <nav className="space-y-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`profile-nav-item w-full flex items-center space-x-3 px-6 py-4 text-left rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'active bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:text-gray-900 border border-white/30'
                    }`}
                  >
                    <tab.icon className="text-xl" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="profile-card p-8 tab-content">
                {activeTab === 'profile' && renderProfileTab()}
                {activeTab === 'security' && renderSecurityTab()}
                {activeTab === 'notifications' && renderNotificationsTab()}
                {activeTab === 'achievements' && renderAchievementsTab()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;