import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaClock, 
  FaTrophy, 
  FaChartLine,
  FaPlay,
  FaCheck,
  FaCertificate,
  FaUser,
  FaCalendar,
  FaStar,
  FaGraduationCap
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CourseContext } from '../context/CourseContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { enrolledCourses, loading } = useContext(CourseContext);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    hoursLearned: 0,
    certificatesEarned: 0
  });

  useEffect(() => {
    // Add dashboard styles
    const dashboardStyles = document.createElement('style');
    dashboardStyles.textContent = `
      .dashboard-bg {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        overflow: hidden;
      }

      .floating-element {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: float 8s ease-in-out infinite;
      }

      .floating-element:nth-child(1) {
        width: 100px;
        height: 100px;
        top: 10%;
        left: 5%;
        animation-delay: 0s;
      }

      .floating-element:nth-child(2) {
        width: 150px;
        height: 150px;
        top: 70%;
        right: 10%;
        animation-delay: 2s;
      }

      .floating-element:nth-child(3) {
        width: 80px;
        height: 80px;
        top: 40%;
        right: 30%;
        animation-delay: 4s;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(180deg); }
      }

      .welcome-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 24px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
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

      .dashboard-content {
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

      .stat-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
        transition: left 0.6s ease;
      }

      .stat-card:hover::before {
        left: 100%;
      }

      .stat-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      .course-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .course-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
      }

      .progress-bar {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
        transition: width 1s ease-in-out;
      }

      .activity-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        transition: all 0.3s ease;
        margin-bottom: 1rem;
      }

      .activity-card:hover {
        background: rgba(255, 255, 255, 0.95);
        transform: translateX(5px);
      }
    `;
    document.head.appendChild(dashboardStyles);

    // Calculate stats
    if (enrolledCourses) {
      const completed = enrolledCourses.filter(course => course.progress === 100).length;
      setStats({
        totalCourses: enrolledCourses.length,
        completedCourses: completed,
        hoursLearned: enrolledCourses.length * 8, // Assuming 8 hours per course
        certificatesEarned: completed
      });
    }

    return () => {
      document.head.removeChild(dashboardStyles);
    };
  }, [enrolledCourses]);

  const getRecentActivity = () => {
    return [
      {
        id: 1,
        type: 'lesson_completed',
        title: 'Completed: Introduction to JavaScript',
        course: 'JavaScript Fundamentals',
        time: '2 hours ago',
        icon: FaCheck,
        color: 'text-green-600'
      },
      {
        id: 2,
        type: 'course_started',
        title: 'Started: Advanced React Concepts',
        course: 'React Development',
        time: '1 day ago',
        icon: FaPlay,
        color: 'text-blue-600'
      },
      {
        id: 3,
        type: 'certificate_earned',
        title: 'Certificate Earned: Communication Skills',
        course: 'Soft Skills Mastery',
        time: '3 days ago',
        icon: FaCertificate,
        color: 'text-purple-600'
      },
      {
        id: 4,
        type: 'assessment_passed',
        title: 'Assessment Passed: Data Analysis Quiz',
        course: 'Data Science Basics',
        time: '1 week ago',
        icon: FaTrophy,
        color: 'text-yellow-600'
      }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen dashboard-bg">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      {/* Welcome Section */}
      <section className="relative z-10 px-4 pt-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="welcome-card p-8 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-xl text-gray-600">
                  Continue your learning journey and achieve your goals
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <FaGraduationCap className="text-white text-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="dashboard-content relative z-10 px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="stat-card p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBook className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalCourses}</h3>
                  <p className="text-gray-600 text-sm">Enrolled Courses</p>
                </div>

                <div className="stat-card p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.completedCourses}</h3>
                  <p className="text-gray-600 text-sm">Completed</p>
                </div>

                <div className="stat-card p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaClock className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.hoursLearned}</h3>
                  <p className="text-gray-600 text-sm">Hours Learned</p>
                </div>

                <div className="stat-card p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCertificate className="text-white text-xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.certificatesEarned}</h3>
                  <p className="text-gray-600 text-sm">Certificates</p>
                </div>
              </div>

              {/* Enrolled Courses */}
              <div className="stat-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                  <Link 
                    to="/courses" 
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    Browse All Courses →
                  </Link>
                </div>

                {enrolledCourses && enrolledCourses.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {enrolledCourses.slice(0, 4).map((course, index) => {
                      const progress = course.progress || Math.floor(Math.random() * 100);
                      const status = progress === 100 ? 'Completed' : 
                                   progress > 0 ? 'In Progress' : 'Not Started';
                      
                      return (
                        <Link 
                          key={course._id || index}
                          to={`/course/${course._id}`}
                          className="course-card p-6 block"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                              {course.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              status === 'Completed' ? 'bg-green-100 text-green-700' :
                              status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {status}
                            </span>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                              <span>Progress</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className="progress-bar h-3 rounded-full"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <FaClock className="mr-2" />
                            <span>{course.duration || '8 hours'}</span>
                            <span className="mx-2">•</span>
                            <FaStar className="mr-1 text-yellow-500" />
                            <span>4.8</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaBook className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                    <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course</p>
                    <Link 
                      to="/courses" 
                      className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      <FaBook className="mr-2" />
                      Browse Courses
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Recent Activity */}
              <div className="stat-card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-card p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                          <activity.icon className="text-sm" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {activity.course}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="stat-card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                <div className="space-y-3">
                  <Link 
                    to="/courses"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                  >
                    <FaBook className="mr-2" />
                    Browse Courses
                  </Link>
                  <Link 
                    to="/profile"
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <FaUser className="mr-2" />
                    Edit Profile
                  </Link>
                  <Link 
                    to="/certificates"
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <FaChartLine className="mr-2" />
                    View Progress
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;