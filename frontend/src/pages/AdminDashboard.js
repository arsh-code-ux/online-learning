import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUsers, FaCertificate, FaBookOpen, FaChartLine, 
  FaUserGraduate, FaMoneyBillWave, FaCog, FaSignOutAlt,
  FaHome, FaDatabase, FaPlus, FaEdit, FaSearch, FaTrash,
  FaEye, FaDownload, FaEnvelope, FaShieldAlt, FaBan, FaUnlock, FaKey,
  FaTrophy, FaClock, FaCheckCircle, FaTimesCircle, FaStar, FaArrowUp,
  FaArrowDown, FaCalendarAlt, FaGraduationCap, FaDollarSign, FaUserCheck,
  FaFileDownload, FaFileCsv, FaFileExcel, FaFileCode
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [blockedEmails, setBlockedEmails] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEnrollments: 0,
    totalCertificates: 0,
    totalCourses: 0,
    revenue: 0,
    blockedAccounts: 0,
    activeUsers: 0,
    completionRate: 0,
    avgCourseRating: 0,
    newUsersThisMonth: 0,
    revenueGrowth: 0
  });
  
  // Courses Management States
  const [courses, setCourses] = useState([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'soft-skills',
    price: 0,
    isPremium: false,
    instructor: user?.name || 'Admin',
    duration: '',
    level: 'beginner',
    thumbnail: ''
  });
  const [allUsers, setAllUsers] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized! Admin access only.');
      navigate('/admin/login');
      return;
    }
    loadAllData();
    loadCourses();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      loadAllData();
      loadCourses();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user, navigate]);

  const loadAllData = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const certs = JSON.parse(localStorage.getItem('certificates') || '[]');
    const premiumCourses = JSON.parse(localStorage.getItem('premiumCourses') || '[]');
    const blocked = JSON.parse(localStorage.getItem('blockedAdminEmails') || '[]');
    const adminCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    
    // Get all available courses from different sources
    const softSkillsCourses = JSON.parse(localStorage.getItem('softSkillsCourses') || '[]');
    const technicalCourses = JSON.parse(localStorage.getItem('technicalCourses') || '[]');
    const analyticalCourses = JSON.parse(localStorage.getItem('analyticalCourses') || '[]');
    
    // Combine all courses and remove duplicates
    const allAvailableCourses = [
      ...adminCourses,
      ...softSkillsCourses,
      ...technicalCourses,
      ...analyticalCourses,
      ...premiumCourses
    ];
    
    // Remove duplicates based on title
    const uniqueCourses = allAvailableCourses.reduce((acc, course) => {
      if (!acc.find(c => c.title === course.title)) {
        acc.push(course);
      }
      return acc;
    }, []);
    
    setBlockedEmails(blocked);

    // Calculate enrollments and add to users
    const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    let totalEnrollments = 0;
    
    const usersWithEnrollments = users.map(u => {
      const enrollments = Object.keys(courseProgress).filter(key => key.startsWith(u.id || u.email));
      totalEnrollments += enrollments.length;
      
      return {
        ...u,
        enrollments,
        enrollmentCount: enrollments.length
      };
    });

    // Calculate active users (users with enrollments in last 30 days)
    const activeUsers = usersWithEnrollments.filter(u => u.enrollmentCount > 0).length;
    
    // Calculate completion rate
    const completedCourses = Object.values(courseProgress).filter(p => p >= 100).length;
    const completionRate = totalEnrollments > 0 ? Math.round((completedCourses / totalEnrollments) * 100) : 0;
    
    // Calculate new users this month
    const currentMonth = new Date().getMonth();
    const newUsersThisMonth = usersWithEnrollments.filter(u => {
      if (u.createdAt) {
        const userMonth = new Date(u.createdAt).getMonth();
        return userMonth === currentMonth;
      }
      return false;
    }).length;

    setAllUsers(usersWithEnrollments);
    setCertificates(certs);

    // Generate recent activity
    generateRecentActivity(usersWithEnrollments, certs, adminCourses);

    setStats({
      totalUsers: usersWithEnrollments.length,
      totalEnrollments,
      totalCertificates: certs.length,
      totalCourses: uniqueCourses.length, // Use total unique courses count
      revenue: premiumCourses.length * 999,
      blockedAccounts: blocked.length,
      activeUsers,
      completionRate,
      avgCourseRating: 4.5,
      newUsersThisMonth,
      revenueGrowth: 15
    });
  };

  const generateRecentActivity = (users, certs, courses) => {
    const activities = [];
    
    // Recent user registrations
    users.slice(-5).forEach(u => {
      activities.push({
        type: 'user_registered',
        icon: FaUserCheck,
        color: 'text-green-500',
        bg: 'bg-green-50',
        message: `${u.name} joined the platform`,
        time: u.createdAt || 'Recently'
      });
    });
    
    // Recent certificates
    certs.slice(-5).forEach(cert => {
      activities.push({
        type: 'certificate_issued',
        icon: FaCertificate,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        message: `Certificate issued for ${cert.courseName || 'a course'}`,
        time: cert.issuedDate || 'Recently'
      });
    });
    
    // Recent courses added
    courses.slice(-3).forEach(course => {
      activities.push({
        type: 'course_added',
        icon: FaBookOpen,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        message: `New course added: ${course.title}`,
        time: course.createdAt || 'Recently'
      });
    });
    
    // Sort by time and take recent 10
    setRecentActivity(activities.slice(-10).reverse());
  };

  const loadCourses = () => {
    const storedCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    setCourses(storedCourses);
  };

  // Download functions for different formats
  const downloadJSON = () => {
    const data = {
      users: allUsers,
      courses: courses,
      certificates: certificates,
      blockedEmails: blockedEmails,
      stats: stats,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lms-data-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('✅ JSON file downloaded successfully!');
  };

  const downloadCSV = () => {
    // Prepare CSV data
    let csv = 'LMS Platform Data Export\n\n';
    
    // Users data
    csv += 'USERS DATA\n';
    csv += 'Name,Email,Role,Enrolled Courses,Certificates,Join Date\n';
    allUsers.forEach(user => {
      csv += `"${user.name}","${user.email}","${user.role || 'student'}",${user.enrollmentCount || 0},${certificates.filter(c => c.userId === user.id).length},"${user.createdAt || 'N/A'}"\n`;
    });
    
    csv += '\n\nCOURSES DATA\n';
    csv += 'Title,Category,Level,Price,Premium,Instructor,Duration\n';
    courses.forEach(course => {
      csv += `"${course.title}","${course.category}","${course.level}","${course.price}","${course.isPremium ? 'Yes' : 'No'}","${course.instructor}","${course.duration || 'N/A'}"\n`;
    });
    
    csv += '\n\nCERTIFICATES DATA\n';
    csv += 'User Email,Course Name,Issue Date,Certificate ID\n';
    certificates.forEach(cert => {
      csv += `"${cert.userEmail || 'N/A'}","${cert.courseName || 'N/A'}","${cert.issuedDate || 'N/A'}","${cert.certificateId || 'N/A'}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lms-data-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('✅ CSV file downloaded successfully!');
  };

  const downloadExcel = () => {
    // Create HTML table format (can be opened in Excel)
    let html = '<html><head><meta charset="utf-8"><style>table{border-collapse:collapse;width:100%;}th,td{border:1px solid black;padding:8px;text-align:left;}th{background-color:#667eea;color:white;}</style></head><body>';
    
    html += '<h1>LMS Platform Data Export</h1>';
    html += '<p>Export Date: ' + new Date().toLocaleString() + '</p>';
    
    // Users table
    html += '<h2>Users Data</h2>';
    html += '<table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Enrolled Courses</th><th>Certificates</th><th>Join Date</th></tr></thead><tbody>';
    allUsers.forEach(user => {
      html += `<tr><td>${user.name}</td><td>${user.email}</td><td>${user.role || 'student'}</td><td>${user.enrollmentCount || 0}</td><td>${certificates.filter(c => c.userId === user.id).length}</td><td>${user.createdAt || 'N/A'}</td></tr>`;
    });
    html += '</tbody></table><br><br>';
    
    // Courses table
    html += '<h2>Courses Data</h2>';
    html += '<table><thead><tr><th>Title</th><th>Category</th><th>Level</th><th>Price</th><th>Premium</th><th>Instructor</th><th>Duration</th></tr></thead><tbody>';
    courses.forEach(course => {
      html += `<tr><td>${course.title}</td><td>${course.category}</td><td>${course.level}</td><td>${course.price}</td><td>${course.isPremium ? 'Yes' : 'No'}</td><td>${course.instructor}</td><td>${course.duration || 'N/A'}</td></tr>`;
    });
    html += '</tbody></table><br><br>';
    
    // Certificates table
    html += '<h2>Certificates Data</h2>';
    html += '<table><thead><tr><th>User Email</th><th>Course Name</th><th>Issue Date</th><th>Certificate ID</th></tr></thead><tbody>';
    certificates.forEach(cert => {
      html += `<tr><td>${cert.userEmail || 'N/A'}</td><td>${cert.courseName || 'N/A'}</td><td>${cert.issuedDate || 'N/A'}</td><td>${cert.certificateId || 'N/A'}</td></tr>`;
    });
    html += '</tbody></table>';
    
    html += '</body></html>';
    
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lms-data-${Date.now()}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('✅ Excel file downloaded successfully!');
  };

  const downloadAllFormats = () => {
    downloadJSON();
    setTimeout(() => downloadCSV(), 500);
    setTimeout(() => downloadExcel(), 1000);
    toast.success('✅ All formats downloaded successfully!');
  };

  const handleCourseFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseForm({
      ...courseForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSaveCourse = (e) => {
    e.preventDefault();
    
    if (!courseForm.title.trim()) {
      toast.error('Course title is required');
      return;
    }

    if (!courseForm.description.trim()) {
      toast.error('Course description is required');
      return;
    }

    const storedCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
    
    if (editingCourse) {
      const updatedCourses = storedCourses.map(course =>
        course.id === editingCourse.id ? { ...courseForm, id: editingCourse.id } : course
      );
      localStorage.setItem('adminCourses', JSON.stringify(updatedCourses));
      toast.success('✅ Course updated successfully!');
    } else {
      const newCourse = {
        ...courseForm,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        students: 0,
        rating: 0
      };
      storedCourses.push(newCourse);
      localStorage.setItem('adminCourses', JSON.stringify(storedCourses));
      toast.success('✅ Course added successfully!');
    }

    setCourseForm({
      title: '',
      description: '',
      category: 'soft-skills',
      price: 0,
      isPremium: false,
      instructor: user?.name || 'Admin',
      duration: '',
      level: 'beginner',
      thumbnail: ''
    });
    setEditingCourse(null);
    setShowCourseForm(false);
    loadCourses();
    loadAllData();
  };

  const handleEditCourse = (course) => {
    setCourseForm(course);
    setEditingCourse(course);
    setShowCourseForm(true);
    setActiveTab('courses');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const handleDeleteCourse = (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      const storedCourses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
      const updatedCourses = storedCourses.filter(course => course.id !== courseId);
      localStorage.setItem('adminCourses', JSON.stringify(updatedCourses));
      loadCourses();
      loadAllData();
      toast.success('✅ Course deleted successfully');
    }
  };

  const handleCancelCourseForm = () => {
    setCourseForm({
      title: '',
      description: '',
      category: 'soft-skills',
      price: 0,
      isPremium: false,
      instructor: user?.name || 'Admin',
      duration: '',
      level: 'beginner',
      thumbnail: ''
    });
    setEditingCourse(null);
    setShowCourseForm(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      loadAllData();
      toast.success('✅ User deleted successfully');
    }
  };

  const handleUnblockEmail = (email) => {
    if (window.confirm(`Are you sure you want to unblock ${email}?`)) {
      const blocked = JSON.parse(localStorage.getItem('blockedAdminEmails') || '[]');
      const updated = blocked.filter(e => e !== email);
      localStorage.setItem('blockedAdminEmails', JSON.stringify(updated));
      loadAllData();
      toast.success(`✅ ${email} has been unblocked!`);
    }
  };

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => 
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm]);

  // Enhanced Stat Card Component
  const StatCard = ({ icon: Icon, title, value, trend, trendValue, color, bgColor, subtitle }) => (
    <div className={`stat-card ${bgColor} group`}>
      <div className="stat-card-content">
        <div className="stat-info">
          <p className="stat-title">{title}</p>
          <h3 className="stat-value">{value}</h3>
          {subtitle && <p className="stat-subtitle">{subtitle}</p>}
          {trend && (
            <div className={`stat-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`stat-icon ${color}`}>
          <Icon />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ tab, icon: Icon, label, badge }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`tab-button ${activeTab === tab ? 'tab-active' : ''}`}
    >
      <Icon />
      <span>{label}</span>
      {badge > 0 && <span className="tab-badge">{badge}</span>}
    </button>
  );

  return (
    <div className="admin-dashboard">
      {/* Modern Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <FaShieldAlt />
            </div>
            <div>
              <h1 className="header-title">Admin Control Center</h1>
              <p className="header-subtitle">Welcome back, {user?.name || 'Admin'}</p>
            </div>
          </div>
          
          <div className="header-right">
            <div className="header-time">
              <FaClock className="mr-2" />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}</span>
            </div>
            <button onClick={() => navigate('/')} className="header-btn">
              <FaHome />
              <span>Home</span>
            </button>
            <button onClick={handleLogout} className="header-btn logout-btn">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-content">
            <TabButton tab="overview" icon={FaChartLine} label="Dashboard" />
            <TabButton tab="users" icon={FaUsers} label="Users" badge={stats.totalUsers} />
            <TabButton tab="courses" icon={FaBookOpen} label="Courses" badge={stats.totalCourses} />
            <TabButton tab="certificates" icon={FaCertificate} label="Certificates" badge={stats.totalCertificates} />
            <TabButton tab="security" icon={FaShieldAlt} label="Security" badge={stats.blockedAccounts} />
            <TabButton tab="alldata" icon={FaDatabase} label="All Data" />
            <TabButton tab="settings" icon={FaCog} label="Settings" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="dashboard-content">
              <div className="content-header">
                <h2 className="content-title">📊 Dashboard Overview</h2>
                <p className="content-subtitle">Real-time analytics and insights</p>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <StatCard 
                  icon={FaUsers} 
                  title="Total Users" 
                  value={stats.totalUsers}
                  subtitle={`${stats.newUsersThisMonth} new this month`}
                  trend="up"
                  trendValue="+12%"
                  color="bg-gradient-to-br from-blue-500 to-blue-600" 
                  bgColor="stat-bg-blue"
                />
                <StatCard 
                  icon={FaUserGraduate} 
                  title="Active Students" 
                  value={stats.activeUsers}
                  subtitle={`${stats.completionRate}% completion rate`}
                  trend="up"
                  trendValue="+8%"
                  color="bg-gradient-to-br from-green-500 to-green-600" 
                  bgColor="stat-bg-green"
                />
                <StatCard 
                  icon={FaBookOpen} 
                  title="Total Courses" 
                  value={stats.totalCourses}
                  subtitle="Available courses"
                  color="bg-gradient-to-br from-orange-500 to-orange-600" 
                  bgColor="stat-bg-orange"
                />
                <StatCard 
                  icon={FaCertificate} 
                  title="Certificates" 
                  value={stats.totalCertificates}
                  subtitle="Issued certificates"
                  trend="up"
                  trendValue="+25%"
                  color="bg-gradient-to-br from-purple-500 to-purple-600" 
                  bgColor="stat-bg-purple"
                />
                <StatCard 
                  icon={FaMoneyBillWave} 
                  title="Revenue" 
                  value={`₹${stats.revenue}`}
                  subtitle={`+${stats.revenueGrowth}% this month`}
                  trend="up"
                  trendValue={`+₹${Math.round(stats.revenue * 0.15)}`}
                  color="bg-gradient-to-br from-emerald-500 to-emerald-600" 
                  bgColor="stat-bg-emerald"
                />
                <StatCard 
                  icon={FaTrophy} 
                  title="Avg Rating" 
                  value={stats.avgCourseRating.toFixed(1)}
                  subtitle="Course ratings"
                  color="bg-gradient-to-br from-yellow-500 to-yellow-600" 
                  bgColor="stat-bg-yellow"
                />
                <StatCard 
                  icon={FaGraduationCap} 
                  title="Enrollments" 
                  value={stats.totalEnrollments}
                  subtitle="Total enrollments"
                  trend="up"
                  trendValue="+18%"
                  color="bg-gradient-to-br from-indigo-500 to-indigo-600" 
                  bgColor="stat-bg-indigo"
                />
                <StatCard 
                  icon={FaBan} 
                  title="Blocked Accounts" 
                  value={stats.blockedAccounts}
                  subtitle="Security blocks"
                  color="bg-gradient-to-br from-red-500 to-red-600" 
                  bgColor="stat-bg-red"
                />
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="overview-grid">
                {/* Quick Actions */}
                <div className="quick-actions-card">
                  <h3 className="card-title">⚡ Quick Actions</h3>
                  <div className="quick-actions-grid">
                    <button onClick={() => setActiveTab('courses')} className="action-btn action-primary">
                      <FaPlus />
                      <span>Add New Course</span>
                    </button>
                    <button onClick={() => setActiveTab('users')} className="action-btn action-success">
                      <FaUsers />
                      <span>Manage Users</span>
                    </button>
                    <button onClick={() => setActiveTab('certificates')} className="action-btn action-warning">
                      <FaCertificate />
                      <span>View Certificates</span>
                    </button>
                    <button onClick={() => setActiveTab('security')} className="action-btn action-danger">
                      <FaShieldAlt />
                      <span>Security Center</span>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity-card">
                  <h3 className="card-title">📋 Recent Activity</h3>
                  <div className="activity-list">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="activity-item">
                          <div className={`activity-icon ${activity.bg}`}>
                            <activity.icon className={activity.color} />
                          </div>
                          <div className="activity-content">
                            <p className="activity-message">{activity.message}</p>
                            <span className="activity-time">{activity.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <FaClock className="empty-icon" />
                        <p>No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Course Performance (if courses exist) */}
              {courses.length > 0 && (
                <div className="performance-card">
                  <h3 className="card-title">📈 Top Performing Courses</h3>
                  <div className="course-performance-grid">
                    {courses.slice(0, 3).map((course, index) => (
                      <div key={course.id} className="performance-item">
                        <div className="performance-rank">#{index + 1}</div>
                        <div className="performance-info">
                          <h4>{course.title}</h4>
                          <p>{course.category.replace('-', ' ')}</p>
                        </div>
                        <div className="performance-stats">
                          <div className="performance-stat">
                            <FaStar className="text-yellow-500" />
                            <span>{course.rating || 4.5}</span>
                          </div>
                          <div className="performance-stat">
                            <FaUsers className="text-blue-500" />
                            <span>{course.students || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Courses Tab - Keep existing implementation */}
          {activeTab === 'courses' && (
            <div className="dashboard-content">
              <div className="content-header">
                <div>
                  <h2 className="content-title">📚 Course Management</h2>
                  <p className="content-subtitle">Create and manage your courses</p>
                </div>
                <button
                  onClick={() => setShowCourseForm(!showCourseForm)}
                  className="primary-btn"
                >
                  <FaPlus />
                  <span>{showCourseForm ? 'Cancel' : 'Add Course'}</span>
                </button>
              </div>

              {/* Course Form */}
              {showCourseForm && (
                <div className="course-form-card">
                  <h3 className="form-title">
                    {editingCourse ? '✏️ Edit Course' : '➕ Create New Course'}
                  </h3>
                  <form onSubmit={handleSaveCourse} className="course-form">
                    <div className="form-grid">
                      <div className="form-group col-span-2">
                        <label className="form-label">Course Title *</label>
                        <input
                          type="text"
                          name="title"
                          value={courseForm.title}
                          onChange={handleCourseFormChange}
                          className="form-input"
                          placeholder="e.g., Introduction to React"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Category *</label>
                        <select
                          name="category"
                          value={courseForm.category}
                          onChange={handleCourseFormChange}
                          className="form-input"
                          required
                        >
                          <option value="soft-skills">Soft Skills</option>
                          <option value="technical-skills">Technical Skills</option>
                          <option value="analytical-skills">Analytical Skills</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Level *</label>
                        <select
                          name="level"
                          value={courseForm.level}
                          onChange={handleCourseFormChange}
                          className="form-input"
                          required
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Duration</label>
                        <input
                          type="text"
                          name="duration"
                          value={courseForm.duration}
                          onChange={handleCourseFormChange}
                          className="form-input"
                          placeholder="e.g., 4 weeks, 20 hours"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Price (₹)</label>
                        <input
                          type="number"
                          name="price"
                          value={courseForm.price}
                          onChange={handleCourseFormChange}
                          className="form-input"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Instructor</label>
                        <input
                          type="text"
                          name="instructor"
                          value={courseForm.instructor}
                          onChange={handleCourseFormChange}
                          className="form-input"
                          placeholder="Instructor name"
                        />
                      </div>

                      <div className="form-group col-span-2">
                        <label className="form-label">Thumbnail URL</label>
                        <input
                          type="url"
                          name="thumbnail"
                          value={courseForm.thumbnail}
                          onChange={handleCourseFormChange}
                          className="form-input"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div className="form-group col-span-2">
                        <label className="form-label">Description *</label>
                        <textarea
                          name="description"
                          value={courseForm.description}
                          onChange={handleCourseFormChange}
                          className="form-textarea"
                          rows="4"
                          placeholder="Course description..."
                          required
                        />
                      </div>

                      <div className="form-group col-span-2">
                        <label className="form-checkbox">
                          <input
                            type="checkbox"
                            name="isPremium"
                            checked={courseForm.isPremium}
                            onChange={handleCourseFormChange}
                          />
                          <span>🌟 Premium Course (Requires Payment)</span>
                        </label>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="button"
                        onClick={handleCancelCourseForm}
                        className="secondary-btn"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="primary-btn">
                        {editingCourse ? '💾 Update Course' : '✅ Create Course'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Courses List */}
              {courses.length === 0 ? (
                <div className="empty-state-large">
                  <FaBookOpen className="empty-icon-large" />
                  <h3>No courses yet</h3>
                  <p>Create your first course to get started!</p>
                  <button
                    onClick={() => setShowCourseForm(true)}
                    className="primary-btn"
                  >
                    <FaPlus />
                    <span>Add Your First Course</span>
                  </button>
                </div>
              ) : (
                <div className="courses-grid">
                  {courses.map((course) => (
                    <div key={course.id} className="course-card">
                      <div className="course-thumbnail">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} />
                        ) : (
                          <div className="course-thumbnail-placeholder">
                            <FaBookOpen />
                          </div>
                        )}
                        {course.isPremium && (
                          <span className="course-premium-badge">⭐ Premium</span>
                        )}
                      </div>

                      <div className="course-content">
                        <h3 className="course-title">{course.title}</h3>
                        <p className="course-description">{course.description}</p>

                        <div className="course-meta">
                          <div className="course-meta-item">
                            <span className="meta-label">Category:</span>
                            <span className="meta-value">{course.category.replace('-', ' ')}</span>
                          </div>
                          <div className="course-meta-item">
                            <span className="meta-label">Level:</span>
                            <span className="meta-value">{course.level}</span>
                          </div>
                          {course.duration && (
                            <div className="course-meta-item">
                              <span className="meta-label">Duration:</span>
                              <span className="meta-value">{course.duration}</span>
                            </div>
                          )}
                          <div className="course-meta-item">
                            <span className="meta-label">Price:</span>
                            <span className="meta-value price">
                              {course.price > 0 ? `₹${course.price}` : 'Free'}
                            </span>
                          </div>
                        </div>

                        <div className="course-actions">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="course-action-btn edit-btn"
                          >
                            <FaEdit />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="course-action-btn delete-btn"
                          >
                            <FaTrash />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="dashboard-content">
              <div className="content-header">
                <div>
                  <h2 className="content-title">👥 User Management</h2>
                  <p className="content-subtitle">Manage all platform users</p>
                </div>
                <div className="search-box">
                  <FaSearch />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="empty-state-large">
                  <FaUsers className="empty-icon-large" />
                  <h3>No users found</h3>
                  <p>No users match your search criteria</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Enrollments</th>
                        <th>Certificates</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id || user.email}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <span>{user.name}</span>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`role-badge ${user.role === 'admin' ? 'role-admin' : 'role-student'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            <span className="count-badge">{user.enrollmentCount || 0}</span>
                          </td>
                          <td>
                            <span className="count-badge cert-badge">
                              {certificates.filter(c => c.userId === user.id).length}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="table-action-btn delete"
                              title="Delete user"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Other tabs - Keep existing implementations */}
          {activeTab === 'certificates' && (
            <div className="dashboard-content">
              <div className="content-header">
                <div>
                  <h2 className="content-title">🎓 Certificates</h2>
                  <p className="content-subtitle">Issued certificates</p>
                </div>
              </div>
              <div className="certificates-grid">
                {certificates.length === 0 ? (
                  <div className="empty-state-large">
                    <FaCertificate className="empty-icon-large" />
                    <h3>No certificates issued yet</h3>
                  </div>
                ) : (
                  certificates.map((cert, index) => (
                    <div key={index} className="certificate-card">
                      <FaCertificate className="cert-icon" />
                      <h4>{cert.courseName || 'Course Certificate'}</h4>
                      <p>{cert.userName || 'Student'}</p>
                      <span className="cert-date">{cert.issuedDate || 'Recently'}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="dashboard-content">
              <div className="content-header">
                <div>
                  <h2 className="content-title">🔒 Security Center</h2>
                  <p className="content-subtitle">Manage blocked accounts</p>
                </div>
              </div>

              <div className="security-stats-grid">
                <StatCard 
                  icon={FaBan} 
                  title="Blocked Accounts" 
                  value={stats.blockedAccounts}
                  color="bg-gradient-to-br from-red-500 to-red-600" 
                  bgColor="stat-bg-red"
                />
                <StatCard 
                  icon={FaKey} 
                  title="Max Attempts" 
                  value="3"
                  color="bg-gradient-to-br from-yellow-500 to-yellow-600" 
                  bgColor="stat-bg-yellow"
                />
              </div>

              {blockedEmails.length === 0 ? (
                <div className="empty-state-large">
                  <FaCheckCircle className="empty-icon-large text-green-500" />
                  <h3>All Clear!</h3>
                  <p>No blocked accounts</p>
                </div>
              ) : (
                <div className="blocked-list">
                  {blockedEmails.map((email, index) => (
                    <div key={index} className="blocked-item">
                      <div className="blocked-info">
                        <FaBan className="text-red-500" />
                        <span>{email}</span>
                      </div>
                      <button
                        onClick={() => handleUnblockEmail(email)}
                        className="unblock-btn"
                      >
                        <FaUnlock />
                        <span>Unblock</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'alldata' && (
            <div className="dashboard-content">
              <div className="content-header">
                <div>
                  <h2 className="content-title">💾 Complete Database Overview</h2>
                  <p className="content-subtitle">Detailed information for all users and their activities</p>
                </div>
                
                {/* Download Buttons */}
                <div className="download-buttons-group">
                  <button onClick={downloadJSON} className="download-btn download-json" title="Download as JSON">
                    <FaFileCode />
                    <span>JSON</span>
                  </button>
                  <button onClick={downloadCSV} className="download-btn download-csv" title="Download as CSV">
                    <FaFileCsv />
                    <span>CSV</span>
                  </button>
                  <button onClick={downloadExcel} className="download-btn download-excel" title="Download as Excel">
                    <FaFileExcel />
                    <span>Excel</span>
                  </button>
                  <button onClick={downloadAllFormats} className="download-btn download-all" title="Download All Formats">
                    <FaFileDownload />
                    <span>All Formats</span>
                  </button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="data-summary-grid">
                <div className="data-summary-card">
                  <FaUsers className="summary-icon" />
                  <div>
                    <h4>Users Database</h4>
                    <p>{allUsers.length} total users</p>
                  </div>
                </div>
                <div className="data-summary-card">
                  <FaBookOpen className="summary-icon" />
                  <div>
                    <h4>Courses Database</h4>
                    <p>{courses.length} total courses</p>
                  </div>
                </div>
                <div className="data-summary-card">
                  <FaCertificate className="summary-icon" />
                  <div>
                    <h4>Certificates Database</h4>
                    <p>{certificates.length} certificates</p>
                  </div>
                </div>
                <div className="data-summary-card">
                  <FaBan className="summary-icon" />
                  <div>
                    <h4>Security Database</h4>
                    <p>{blockedEmails.length} blocked emails</p>
                  </div>
                </div>
              </div>

              {/* Detailed User Information */}
              <div className="all-data-section">
                <h3 className="section-title">
                  <FaUsers /> Detailed User Information
                </h3>
                
                {allUsers.length === 0 ? (
                  <div className="empty-state-large">
                    <FaUsers className="empty-icon-large" />
                    <h3>No users found</h3>
                    <p>No registered users in the system</p>
                  </div>
                ) : (
                  <div className="user-details-grid">
                    {allUsers.map((userData, index) => {
                      // Get user's course progress
                      const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
                      const userProgress = {};
                      
                      Object.keys(courseProgress).forEach(key => {
                        if (key.startsWith(userData.id || userData.email)) {
                          const courseId = key.split('_')[1];
                          userProgress[courseId] = courseProgress[key];
                        }
                      });

                      // Get user's certificates
                      const userCertificates = certificates.filter(cert => 
                        cert.userId === userData.id || cert.userEmail === userData.email
                      );

                      // Get enrolled courses details
                      const enrolledCourses = courses.filter(course => 
                        Object.keys(userProgress).includes(course.id)
                      );

                      // Calculate user stats
                      const completedCourses = Object.values(userProgress).filter(p => p >= 100).length;
                      const inProgressCourses = Object.values(userProgress).filter(p => p > 0 && p < 100).length;
                      const totalProgress = Object.values(userProgress).length > 0
                        ? Math.round(Object.values(userProgress).reduce((a, b) => a + b, 0) / Object.values(userProgress).length)
                        : 0;

                      return (
                        <div key={userData.id || index} className="user-detail-card">
                          {/* User Header */}
                          <div className="user-detail-header">
                            <div className="user-avatar-large">
                              {userData.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-header-info">
                              <h4 className="user-detail-name">{userData.name}</h4>
                              <p className="user-detail-email">{userData.email}</p>
                              <div className="user-badges">
                                <span className={`role-badge ${userData.role === 'admin' ? 'role-admin' : 'role-student'}`}>
                                  {userData.role || 'student'}
                                </span>
                                {userData.createdAt && (
                                  <span className="date-badge">
                                    <FaCalendarAlt /> Joined: {new Date(userData.createdAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* User Statistics */}
                          <div className="user-stats-grid">
                            <div className="user-stat-item">
                              <div className="stat-icon-small bg-gradient-to-br from-blue-500 to-blue-600">
                                <FaBookOpen />
                              </div>
                              <div>
                                <p className="stat-label-small">Enrolled Courses</p>
                                <p className="stat-value-small">{enrolledCourses.length}</p>
                              </div>
                            </div>
                            <div className="user-stat-item">
                              <div className="stat-icon-small bg-gradient-to-br from-green-500 to-green-600">
                                <FaCheckCircle />
                              </div>
                              <div>
                                <p className="stat-label-small">Completed</p>
                                <p className="stat-value-small">{completedCourses}</p>
                              </div>
                            </div>
                            <div className="user-stat-item">
                              <div className="stat-icon-small bg-gradient-to-br from-yellow-500 to-yellow-600">
                                <FaClock />
                              </div>
                              <div>
                                <p className="stat-label-small">In Progress</p>
                                <p className="stat-value-small">{inProgressCourses}</p>
                              </div>
                            </div>
                            <div className="user-stat-item">
                              <div className="stat-icon-small bg-gradient-to-br from-purple-500 to-purple-600">
                                <FaCertificate />
                              </div>
                              <div>
                                <p className="stat-label-small">Certificates</p>
                                <p className="stat-value-small">{userCertificates.length}</p>
                              </div>
                            </div>
                          </div>

                          {/* Overall Progress */}
                          {enrolledCourses.length > 0 && (
                            <div className="user-progress-section">
                              <div className="progress-header">
                                <span className="progress-label">Overall Progress</span>
                                <span className="progress-percentage">{totalProgress}%</span>
                              </div>
                              <div className="progress-bar-container">
                                <div 
                                  className="progress-bar-fill" 
                                  style={{ width: `${totalProgress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {/* Enrolled Courses Details */}
                          {enrolledCourses.length > 0 && (
                            <div className="enrolled-courses-section">
                              <h5 className="section-subtitle">
                                <FaBookOpen /> Enrolled Courses ({enrolledCourses.length})
                              </h5>
                              <div className="enrolled-courses-list">
                                {enrolledCourses.map(course => {
                                  const progress = userProgress[course.id] || 0;
                                  const isCompleted = progress >= 100;
                                  
                                  return (
                                    <div key={course.id} className="enrolled-course-item">
                                      <div className="course-item-header">
                                        <div className="course-item-icon">
                                          {isCompleted ? (
                                            <FaCheckCircle className="text-green-500" />
                                          ) : (
                                            <FaClock className="text-yellow-500" />
                                          )}
                                        </div>
                                        <div className="course-item-info">
                                          <p className="course-item-title">{course.title}</p>
                                          <p className="course-item-category">
                                            {course.category?.replace('-', ' ')} • {course.level}
                                          </p>
                                        </div>
                                        <div className="course-item-progress">
                                          <span className={`progress-badge ${isCompleted ? 'completed' : 'in-progress'}`}>
                                            {progress}%
                                          </span>
                                        </div>
                                      </div>
                                      <div className="course-progress-bar">
                                        <div 
                                          className={`course-progress-fill ${isCompleted ? 'completed' : ''}`}
                                          style={{ width: `${progress}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Certificates Section */}
                          {userCertificates.length > 0 && (
                            <div className="certificates-section">
                              <h5 className="section-subtitle">
                                <FaCertificate /> Certificates Earned ({userCertificates.length})
                              </h5>
                              <div className="certificates-list">
                                {userCertificates.map((cert, idx) => (
                                  <div key={idx} className="certificate-item">
                                    <FaTrophy className="certificate-icon" />
                                    <div className="certificate-info">
                                      <p className="certificate-course">{cert.courseName || 'Course Certificate'}</p>
                                      <p className="certificate-date">
                                        Issued: {cert.issuedDate || 'Recently'}
                                      </p>
                                    </div>
                                    {cert.certificateId && (
                                      <span className="certificate-id">ID: {cert.certificateId.slice(0, 8)}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Activity Summary */}
                          <div className="activity-summary">
                            <div className="activity-summary-item">
                              <FaChartLine className="text-blue-500" />
                              <span>
                                {enrolledCourses.length === 0 
                                  ? 'No courses enrolled yet' 
                                  : `Active in ${enrolledCourses.length} ${enrolledCourses.length === 1 ? 'course' : 'courses'}`
                                }
                              </span>
                            </div>
                            {userData.lastLogin && (
                              <div className="activity-summary-item">
                                <FaClock className="text-green-500" />
                                <span>Last login: {new Date(userData.lastLogin).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          {/* No Activity Message */}
                          {enrolledCourses.length === 0 && userCertificates.length === 0 && (
                            <div className="no-activity-message">
                              <FaTimesCircle className="no-activity-icon" />
                              <p>This user hasn't enrolled in any courses yet</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* All Courses Overview */}
              {courses.length > 0 && (
                <div className="all-data-section">
                  <h3 className="section-title">
                    <FaBookOpen /> All Courses Overview
                  </h3>
                  <div className="courses-overview-grid">
                    {courses.map(course => {
                      // Calculate course statistics
                      const courseProgress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
                      const courseEnrollments = Object.keys(courseProgress).filter(key => 
                        key.includes(`_${course.id}`)
                      ).length;

                      const courseCompletions = Object.entries(courseProgress).filter(([key, value]) => 
                        key.includes(`_${course.id}`) && value >= 100
                      ).length;

                      return (
                        <div key={course.id} className="course-overview-card">
                          <div className="course-overview-header">
                            <h4>{course.title}</h4>
                            {course.isPremium && <span className="premium-badge">⭐ Premium</span>}
                          </div>
                          <p className="course-overview-desc">{course.description}</p>
                          <div className="course-overview-stats">
                            <div className="overview-stat">
                              <FaUsers className="text-blue-500" />
                              <span>{courseEnrollments} enrolled</span>
                            </div>
                            <div className="overview-stat">
                              <FaCheckCircle className="text-green-500" />
                              <span>{courseCompletions} completed</span>
                            </div>
                            <div className="overview-stat">
                              <FaStar className="text-yellow-500" />
                              <span>{course.rating || 4.5} rating</span>
                            </div>
                          </div>
                          <div className="course-overview-meta">
                            <span className="meta-badge">{course.category?.replace('-', ' ')}</span>
                            <span className="meta-badge">{course.level}</span>
                            {course.price > 0 && <span className="meta-badge price">₹{course.price}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="dashboard-content">
              <div className="content-header">
                <div>
                  <h2 className="content-title">⚙️ Settings</h2>
                  <p className="content-subtitle">Admin account settings</p>
                </div>
              </div>

              <div className="settings-card">
                <h3>Account Information</h3>
                <div className="settings-info">
                  <div className="settings-item">
                    <span className="settings-label">Name:</span>
                    <span className="settings-value">{user?.name}</span>
                  </div>
                  <div className="settings-item">
                    <span className="settings-label">Email:</span>
                    <span className="settings-value">{user?.email}</span>
                  </div>
                  <div className="settings-item">
                    <span className="settings-label">Role:</span>
                    <span className="role-badge role-admin">Administrator</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
