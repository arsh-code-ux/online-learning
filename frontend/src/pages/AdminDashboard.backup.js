import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUsers, FaCertificate, FaBookOpen, FaChartLine, 
  FaUserGraduate, FaMoneyBillWave, FaCog, FaSignOutAlt,
  FaHome, FaDatabase, FaPlus, FaEdit
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import AllDataSection from '../components/admin/AllDataSection';
import UserManagement from '../components/admin/UserManagement';
import CourseManagement from '../components/admin/CourseManagement';
import CertificateManagement from '../components/admin/CertificateManagement';
import AdminSettings from '../components/admin/AdminSettings';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEnrollments: 0,
    totalCertificates: 0,
    totalCourses: 0,
    revenue: 0
  });

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized! Admin access only.');
      navigate('/admin/login');
      return;
    }

    // Calculate stats from localStorage
    calculateStats();
  }, [user, navigate]);

  const calculateStats = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const certificates = JSON.parse(localStorage.getItem('certificates') || '[]');
    const premiumCourses = JSON.parse(localStorage.getItem('premiumCourses') || '[]');
    
    // Get all enrollments
    let totalEnrollments = 0;
    users.forEach(u => {
      const userProgress = JSON.parse(localStorage.getItem(`courseProgress_${u.id}`) || '{}');
      totalEnrollments += Object.keys(userProgress).length;
    });

    setStats({
      totalUsers: users.filter(u => u.role !== 'admin').length,
      totalEnrollments,
      totalCertificates: certificates.length,
      totalCourses: 5, // Update based on actual courses
      revenue: premiumCourses.length * 999 // Assuming ₹999 per course
    });
  };

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedCategory]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [coursesData, statsData] = await Promise.all([
        getAllCourses(),
        getAdminStats()
      ]);
      
      setCourses(coursesData || []);
      setStats(statsData || stats);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    setFilteredCourses(filtered);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await deleteCourse(courseId);
        setCourses(courses.filter(course => course._id !== courseId));
        toast.success('Course deleted successfully');
      } catch (error) {
        toast.error('Failed to delete course');
      }
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'soft-skills':
        return 'bg-blue-100 text-blue-700';
      case 'technical-skills':
        return 'bg-green-100 text-green-700';
      case 'analytical-skills':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage courses, monitor performance, and oversee student progress
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <FaPlus className="mr-2" />
              Create Course
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Courses</p>
                  <p className="text-3xl font-bold">{stats.totalCourses}</p>
                </div>
                <FaBook className="text-3xl text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Students</p>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>
                </div>
                <FaUserGraduate className="text-3xl text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold">${stats.totalRevenue}</p>
                </div>
                <FaDollarSign className="text-3xl text-yellow-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg Rating</p>
                  <p className="text-3xl font-bold">{stats.averageRating}</p>
                </div>
                <FaStar className="text-3xl text-purple-200" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Management */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <button className="btn-secondary">
                  <FaDownload className="mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Course Table */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Course Management ({filteredCourses.length} courses)
              </h2>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="p-8 text-center">
                <FaBook className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600">
                  {courses.length === 0 ? 'Create your first course to get started' : 'Try adjusting your search filters'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCourses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={course.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=60&h=60&fit=crop&crop=center`}
                              alt={course.title}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {course.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                by {course.instructor}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(course.category)}`}>
                            {course.category.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <FaUsers className="mr-1 text-gray-400" />
                            {course.enrolledCount || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {course.price === 0 ? (
                            <span className="text-green-600 font-medium">Free</span>
                          ) : (
                            <span className="font-medium">${course.price}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <FaStar className="mr-1 text-yellow-400" />
                            {course.rating || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            course.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {course.isActive ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => window.open(`/course/${course._id}`, '_blank')}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Course"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => {/* Handle edit */}}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit Course"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Course"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="mt-8 grid lg:grid-cols-2 gap-8">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Enrollments</h3>
              <div className="space-y-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=Student${i+1}&size=32&background=6366f1&color=ffffff`}
                      alt="Student"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Student {i + 1}</p>
                      <p className="text-xs text-gray-500">enrolled in React Fundamentals</p>
                    </div>
                    <span className="text-xs text-gray-500">2h ago</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Analytics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Daily Active Users</span>
                  <span className="text-sm font-medium">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Course Completion Rate</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Student Satisfaction</span>
                  <span className="text-sm font-medium">4.8/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monthly Revenue</span>
                  <span className="text-sm font-medium">$12,450</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Course</h2>
            <p className="text-gray-600 mb-6">
              This will redirect you to the course creation page where you can add all the details.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  // Navigate to course creation page
                  window.location.href = '/admin/course/create';
                }}
                className="btn-primary flex-1"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;