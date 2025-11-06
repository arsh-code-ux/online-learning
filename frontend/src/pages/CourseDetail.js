import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaStar, 
  FaClock, 
  FaUsers, 
  FaPlay,
  FaCheck,
  FaDownload,
  FaCertificate,
  FaChartLine,
  FaBookOpen,
  FaVideo,
  FaFileAlt,
  FaQuestionCircle,
  FaShare,
  FaHeart
} from 'react-icons/fa';
import { CourseContext } from '../context/CourseContext';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import CurriculumSection from '../components/CurriculumSection';
import { getCurriculumByCourseId } from '../data/courseCurriculum';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourse, enrollInCourse, checkEnrollment, getCourseFromState } = useContext(CourseContext);
  const { isAuthenticated } = useContext(AuthContext);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [curriculum, setCurriculum] = useState(null);
  const [loadTimedOut, setLoadTimedOut] = useState(false);

  useEffect(() => {
    // Add course detail styles
    const detailStyles = document.createElement('style');
    detailStyles.textContent = `
      .course-detail-page {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        overflow: hidden;
      }

      .floating-bg-shapes {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .floating-shape {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: float 6s ease-in-out infinite;
      }

      .floating-shape:nth-child(1) {
        width: 100px;
        height: 100px;
        top: 10%;
        left: 5%;
        animation-delay: 0s;
      }

      .floating-shape:nth-child(2) {
        width: 150px;
        height: 150px;
        top: 60%;
        right: 10%;
        animation-delay: 2s;
      }

      .floating-shape:nth-child(3) {
        width: 80px;
        height: 80px;
        top: 30%;
        right: 30%;
        animation-delay: 4s;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(180deg); }
      }

      .hero-section {
        background: rgba(255, 255, 255, 0.95);
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

      .content-section {
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

      .enhanced-card {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .enhanced-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 35px 60px rgba(0, 0, 0, 0.15);
      }

      .enroll-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        padding: 16px 32px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        font-size: 18px;
      }

      .enroll-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s ease;
      }

      .enroll-btn:hover::before {
        left: 100%;
      }

      .enroll-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
      }

      .free-badge {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 14px;
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }

      .module-card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        transition: all 0.3s ease;
        margin-bottom: 1rem;
      }

      .module-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .stat-item {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        padding: 1.5rem;
        text-align: center;
        transition: all 0.3s ease;
      }

      .stat-item:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
      }

      .instructor-card {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        padding: 2rem;
        transition: all 0.3s ease;
      }

      .instructor-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
      }
    `;
    document.head.appendChild(detailStyles);

    console.log('CourseDetail: useEffect mount for id=', id, 'isAuthenticated=', isAuthenticated);
    try {
      setLoadTimedOut(false);
      fetchCourse();
    } catch (e) {
      console.error('CourseDetail: fetchCourse threw synchronously', e);
      setLoading(false);
    }

    if (isAuthenticated) {
      try {
        checkEnrollmentStatus();
      } catch (e) {
        console.error('CourseDetail: checkEnrollmentStatus threw synchronously', e);
      }
    }

    // Safety timer: if loading takes too long, show a retry UI instead of an eternal spinner
    const timeoutId = setTimeout(() => {
      if (loading) setLoadTimedOut(true);
    }, 7000);

    return () => {
      document.head.removeChild(detailStyles);
      clearTimeout(timeoutId);
    };
  // Note: avoid including API function references in the dependency array to prevent
  // infinite re-renders when those functions are re-created by context providers.
  // We intentionally only depend on `id` and `isAuthenticated` here.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  const fetchCourse = async () => {
    try {
      console.log('fetchCourse: start for id=', id);
      setLoadTimedOut(false);
      setLoading(true);
      // First try to grab course from local state (fast) to avoid API hang and show immediate content
      try {
        const local = typeof getCourseFromState === 'function' ? getCourseFromState(id) : null;
        if (local) {
          console.log('fetchCourse: found course in state fallback', local);
          setCourse(local);
        }
      } catch (e) {
        console.warn('fetchCourse: getCourseFromState errored', e);
      }

      // Guard against a hanging API call by racing the request with a timeout.
      const coursePromise = (typeof getCourse === 'function') ? getCourse(id) : Promise.resolve(null);
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 6000));
      const courseData = await Promise.race([coursePromise, timeoutPromise]);

      console.log('fetchCourse: result for id=', id, 'courseData=', courseData);

      if (courseData === null) {
        console.warn('getCourse timed out or returned null for id:', id);
        // Continue and try to load a curriculum fallback so UI doesn't hang indefinitely
      }
  // Prefer API result if available, otherwise keep local state course
  if (courseData) setCourse(courseData);
      
      // Load curriculum data based on course ID or title
      let curriculumData = getCurriculumByCourseId(id);
      
      // If no curriculum found with ID, try mapping common IDs
      if (!curriculumData && courseData) {
        const courseTitle = courseData.title?.toLowerCase();
        if (courseTitle?.includes('communication')) {
          curriculumData = getCurriculumByCourseId('communication-skills');
        } else if (courseTitle?.includes('web') || courseTitle?.includes('html') || courseTitle?.includes('development')) {
          curriculumData = getCurriculumByCourseId('web-development');
        } else if (courseTitle?.includes('data') || courseTitle?.includes('analysis')) {
          curriculumData = getCurriculumByCourseId('data-analysis');
        }
      }
      
      // Fallback: use communication-skills curriculum for demo
      if (!curriculumData) {
        curriculumData = getCurriculumByCourseId('communication-skills');
      }
      
      setCurriculum(curriculumData);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const enrolled = await checkEnrollment(id);
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handlePayment = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to make payment');
      navigate('/login');
      return;
    }
    
    toast.info('Redirecting to payment page...');
    navigate(`/payment?course=${curriculum.courseId}&price=${curriculum.price}`);
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to enroll in courses');
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await enrollInCourse(id);
      setIsEnrolled(true);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  // Check if user has paid for premium course
  const hasPaidForPremium = () => {
    if (!curriculum || !curriculum.isPremium) return true; // Free courses
    const premiumCourses = JSON.parse(localStorage.getItem('premiumCourses') || '[]');
    return premiumCourses.includes(curriculum.courseId);
  };

  if (loading && !loadTimedOut) return <LoadingSpinner />;

  if (loading && loadTimedOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">Taking longer than expected…</h2>
          <p className="text-gray-600">We couldn't load the course right now. This may be due to a slow API or a blocked request.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setLoadTimedOut(false);
              fetchCourse();
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
          <button
            onClick={() => {
              navigate('/courses');
            }}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  if (!course && !curriculum) return <div className="text-center py-20">Course not found</div>;

  // Prepare a display object that prefers API course data but falls back to curriculum data
  const displayCourse = {
    title: course?.title || curriculum?.courseTitle || 'Course',
    description: course?.description || curriculum?.description || '',
    duration: course?.duration || curriculum?.totalDuration || '',
    modules: course?.modules || curriculum?.modules || [],
    longDescription: course?.longDescription || course?.description || curriculum?.description || '',
    instructor: course?.instructor || { name: curriculum?.instructor || 'Expert Instructor', title: '', bio: '' },
    rating: course?.rating || 4.8,
  };

  return (
    <div className="min-h-screen course-detail-page">
      {/* Floating Background Shapes */}
      <div className="floating-bg-shapes">
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
        <div className="floating-shape"></div>
      </div>

      {/* Hero Section */}
  <section className="hero-section py-8 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <span className="free-badge">FREE</span>
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-lg" />
                  ))}
                  <span className="ml-2 text-gray-700 font-medium">4.8 (2,340 reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {displayCourse.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {displayCourse.description}
              </p>

              {/* Stats Grid */}
              <div className="stats-grid mb-8">
                <div className="stat-item">
                  <FaUsers className="text-2xl text-blue-600 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">12,450+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="stat-item">
                  <FaClock className="text-2xl text-green-600 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">{displayCourse.duration || '8 hours'}</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
                <div className="stat-item">
                  <FaBookOpen className="text-2xl text-purple-600 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">{displayCourse.modules?.length || 6}</div>
                  <div className="text-sm text-gray-600">Modules</div>
                </div>
                <div className="stat-item">
                  <FaCertificate className="text-2xl text-yellow-600 mx-auto mb-2" />
                  <div className="font-bold text-gray-900">Certificate</div>
                  <div className="text-sm text-gray-600">Included</div>
                </div>
              </div>

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { icon: FaVideo, text: 'HD Video Lectures' },
                  { icon: FaDownload, text: 'Downloadable Resources' },
                  { icon: FaQuestionCircle, text: '24/7 Support' },
                  { icon: FaChartLine, text: 'Progress Tracking' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon className="text-blue-600 text-xl" />
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="enhanced-card p-8 sticky top-8">
                <div className="text-center mb-8">
                  {curriculum && curriculum.isPremium ? (
                    hasPaidForPremium() ? (
                      <>
                        <div className="text-4xl font-bold text-green-600 mb-2">✓ PREMIUM</div>
                        <div className="text-gray-600">Premium access unlocked</div>
                      </>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-gray-900 mb-2">₹{(curriculum.price / 100).toFixed(2)}</div>
                        <div className="text-gray-600">Premium course with certificate</div>
                      </>
                    )
                  ) : (
                    <>
                      <div className="text-4xl font-bold text-gray-900 mb-2">FREE</div>
                      <div className="text-gray-600">Full access to all content</div>
                    </>
                  )}
                </div>

                {isEnrolled ? (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="enroll-btn w-full mb-6"
                  >
                    <FaPlay className="mr-3" />
                    Continue Learning
                  </button>
                ) : curriculum && curriculum.isPremium && !hasPaidForPremium() ? (
                  // Premium course - show payment button first
                  <button
                    onClick={handlePayment}
                    className="payment-btn w-full mb-6"
                    style={{
                      background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                      color: '#1a1a1a',
                      border: 'none',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    💳 Pay ₹{(curriculum.price / 100).toFixed(2)} - Unlock Course
                  </button>
                ) : (
                  // Free course or paid premium course - show enroll button
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="enroll-btn w-full mb-6"
                  >
                    {enrolling ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Enrolling...
                      </div>
                    ) : (
                      <>
                        <FaPlay className="mr-3" />
                        {curriculum && curriculum.isPremium ? 
                          'Enroll Now - Premium Access' : 
                          'Enroll Now - It\'s Free!'
                        }
                      </>
                    )}
                  </button>
                )}

                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <FaHeart />
                      <span>Wishlist</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <FaShare />
                      <span>Share</span>
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500 pt-4 border-t">
                    30-day money-back guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="content-section py-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content - scrollable container */}
            <div className="lg:col-span-2 space-y-12 max-h-[calc(100vh-200px)] overflow-y-auto pr-4" style={{ scrollBehavior: 'smooth' }}>
              {/* Course Curriculum with Video + Content */}
              {displayCourse.modules && displayCourse.modules.length > 0 ? (
                <CurriculumSection 
                  curriculum={{
                    ...curriculum,
                    courseId: displayCourse.id || id,
                    modules: displayCourse.modules.map((module, index) => ({
                      id: module.id || `module-${index}`,
                      title: module.title,
                      description: module.description,
                      duration: module.duration || 'Variable',
                      lessons: module.videos.map((video, videoIndex) => ({
                        id: video.id || `video-${videoIndex}`,
                        title: video.title,
                        videoUrl: video.url,
                        duration: video.duration || '10:00',
                        summary: video.summary || video.title,
                        completed: false
                      }))
                    }))
                  }} 
                  isEnrolled={isEnrolled} 
                />
              ) : (
                <CurriculumSection curriculum={curriculum} isEnrolled={isEnrolled} />
              )}

              {/* Course Description */}
              <div className="enhanced-card p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Course</h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p className="mb-6">
                    {displayCourse.longDescription}
                  </p>
                  <p className="mb-6">
                    This comprehensive course is designed to take you from beginner to advanced level. 
                    You'll learn through hands-on projects, real-world examples, and expert guidance.
                  </p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn:</h3>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start space-x-3">
                      <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Master the fundamentals and advanced concepts</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Build real-world projects to showcase your skills</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Get certified upon successful completion</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Access to exclusive community and resources</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Instructor */}
              <div className="instructor-card">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Your Instructor</h3>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {displayCourse.instructor?.name?.charAt(0) || 'I'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {displayCourse.instructor?.name || 'Expert Instructor'}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {displayCourse.instructor?.title || 'Senior Developer & Educator'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {displayCourse.instructor?.bio || 
                    'Experienced professional with over 10 years in the industry. Passionate about teaching and helping students achieve their goals.'}
                </p>
              </div>

              {/* Course Features */}
              <div className="enhanced-card p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">This Course Includes</h3>
                <div className="space-y-4">
                  {[
                    { icon: FaVideo, text: 'HD video content' },
                    { icon: FaFileAlt, text: 'Downloadable resources' },
                    { icon: FaCertificate, text: 'Certificate of completion' },
                    { icon: FaUsers, text: 'Community access' }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <feature.icon className="text-blue-600" />
                      <span className="text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Actions */}
      <section className="py-12 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Share this course</h3>
            <p className="text-gray-600">Let others know about this amazing course</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="enroll-btn">
              <FaShare className="mr-2" />
              Share Course
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/80 border-2 border-gray-300 text-gray-700 font-semibold hover:bg-white transition-colors">
              <FaHeart className="mr-2" />
              Add to Wishlist
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;