import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaGraduationCap, 
  FaUsers, 
  FaCertificate, 
  FaStar,
  FaArrowRight,
  FaPlay,
  FaCheckCircle,
  FaAward,
  FaRocket,
  FaBolt,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Enhanced CSS animations for HomePage
const homeStyles = `
  @keyframes float-up {
    0% { opacity: 0; transform: translateY(50px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slide-in-left {
    0% { opacity: 0; transform: translateX(-50px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes slide-in-right {
    0% { opacity: 0; transform: translateX(50px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(147, 51, 234, 0.4); }
  }
  
  @keyframes bounce-gentle {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  .animate-float-up { animation: float-up 0.8s ease-out; }
  .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
  .animate-slide-in-right { animation: slide-in-right 0.8s ease-out; }
  .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
  .animate-bounce-gentle { animation: bounce-gentle 2s infinite; }
  
  .feature-card:hover {
    transform: translateY(-10px) scale(1.05);
    transition: all 0.3s ease;
  }
  
  .category-card:hover {
    transform: translateY(-8px) rotateY(5deg);
    transition: all 0.4s ease;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('home-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'home-styles';
    styleSheet.type = 'text/css';
    styleSheet.innerText = homeStyles;
    document.head.appendChild(styleSheet);
  }
}

const HomePage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Carousel state for hero images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Hero carousel images
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
      title: 'Collaborative Learning',
      description: 'Join students worldwide'
    },
    {
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
      title: 'Expert Instructors',
      description: 'Learn from the best'
    },
    {
      url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800',
      title: 'Modern Technology',
      description: 'Stay ahead of the curve'
    },
    {
      url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
      title: 'Interactive Sessions',
      description: 'Engage and learn effectively'
    },
    {
      url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
      title: 'Career Growth',
      description: 'Achieve your goals'
    }
  ];

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const nextImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const prevImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const goToImage = (index) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  const handleExploreCoursesClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error('Please login to explore courses');
      navigate('/login');
      return;
    }
    // If authenticated, allow normal navigation to /courses
  };

  const features = [
    {
      icon: FaGraduationCap,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with years of experience',
      color: 'text-blue-600'
    },
    {
      icon: FaCertificate,
      title: 'Verified Certificates',
      description: 'Earn recognized certificates upon course completion',
      color: 'text-green-600'
    },
    {
      icon: FaUsers,
      title: 'Interactive Community',
      description: 'Connect with fellow learners and instructors',
      color: 'text-purple-600'
    },
    {
      icon: FaAward,
      title: 'Skill-Based Learning',
      description: 'Develop practical skills for career advancement',
      color: 'text-orange-600'
    }
  ];

  const courseCategories = [
    {
      title: 'Soft Skills',
      description: 'Communication, Leadership, Team Management',
      courses: 15,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400',
      link: '/courses?category=Soft Skills'
    },
    {
      title: 'Technical Skills',
      description: 'Programming, Web Development, Data Science',
      courses: 28,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
      link: '/courses?category=Technical Skills'
    },
    {
      title: 'Analytical Skills',
      description: 'Data Analysis, Business Intelligence, Statistics',
      courses: 12,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      link: '/courses?category=Analytical Skills'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager',
      content: 'The courses here transformed my career. The practical approach and expert instructors made all the difference.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c14e?w=100'
    },
    {
      name: 'Michael Chen',
      role: 'Software Developer',
      content: 'Excellent platform with high-quality content. The JavaScript course helped me land my dream job.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      name: 'Emma Wilson',
      role: 'Data Analyst',
      content: 'The analytical skills courses are comprehensive and well-structured. Highly recommend!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Students Enrolled' },
    { number: '100+', label: 'Expert Instructors' },
    { number: '50+', label: 'Courses Available' },
    { number: '95%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-5 animate-spin" style={{animationDuration: '20s'}}></div>
        
        {/* Floating Learning Icons */}
        <div className="absolute top-20 left-10 text-4xl animate-bounce-gentle" style={{animationDelay: '0s'}}>📚</div>
        <div className="absolute top-40 right-20 text-3xl animate-bounce-gentle" style={{animationDelay: '1s'}}>🎓</div>
        <div className="absolute bottom-40 left-20 text-3xl animate-bounce-gentle" style={{animationDelay: '2s'}}>💡</div>
        <div className="absolute bottom-20 right-10 text-4xl animate-bounce-gentle" style={{animationDelay: '0.5s'}}>🚀</div>
        <div className="absolute top-1/3 left-1/4 text-2xl animate-bounce-gentle" style={{animationDelay: '1.5s'}}>⭐</div>
      </div>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white py-24 overflow-hidden z-10">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
                <FaRocket className="text-yellow-400 mr-2" />
                <span className="text-sm font-medium">🎯 Transform Your Career Today</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
                Master New Skills with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"> Expert Courses</span> 🚀
              </h1>
              
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                🌟 Join thousands of learners advancing their careers with our comprehensive 
                skill-building courses in Soft Skills, Technical Skills, and Analytical Skills.
              </p>
              
              {/* Enhanced Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <div className="text-2xl font-bold text-yellow-300">10K+</div>
                  <div className="text-sm text-blue-200">Happy Students</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <div className="text-2xl font-bold text-green-300">50+</div>
                  <div className="text-sm text-blue-200">Expert Courses</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <div className="text-2xl font-bold text-purple-300">100%</div>
                  <div className="text-sm text-blue-200">Certified</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/courses" 
                  onClick={handleExploreCoursesClick}
                  className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 flex items-center justify-center transform hover:scale-105 animate-pulse-glow"
                >
                  <FaBolt className="mr-2 group-hover:animate-bounce" />
                  Explore Courses
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/register" 
                  className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center transform hover:scale-105"
                >
                  <FaPlay className="mr-2 group-hover:animate-pulse" />
                  Start Learning Free
                </Link>
              </div>
            </div>
            <div className="hidden lg:block animate-slide-in-right">
              <div className="relative">
                {/* Automatic Image Carousel */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  {/* Carousel Images */}
                  <div className="relative h-96">
                    {heroImages.map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                          index === currentImageIndex
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-95'
                        }`}
                        style={{
                          transform: index === currentImageIndex ? 'translateX(0)' : 'translateX(100%)',
                          transition: 'all 0.7s ease-in-out'
                        }}
                      >
                        <img 
                          src={image.url} 
                          alt={image.title}
                          className="w-full h-96 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        {/* Image Caption */}
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                          <p className="text-sm text-gray-200">{image.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaChevronLeft className="text-white group-hover:scale-125 transition-transform" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group"
                  >
                    <FaChevronRight className="text-white group-hover:scale-125 transition-transform" />
                  </button>

                  {/* Carousel Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {heroImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === currentImageIndex
                            ? 'w-8 h-2 bg-white'
                            : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Floating Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse-glow pointer-events-auto cursor-pointer hover:bg-white/30 transition-all duration-300">
                      <FaPlay className="text-white text-2xl ml-1" />
                    </div>
                  </div>
                </div>

                {/* Floating Stats Cards */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-sm text-gray-800 p-6 rounded-2xl shadow-xl border border-white/20 animate-float-up z-20">
                  <div className="flex items-center mb-2">
                    <FaStar className="text-yellow-400 mr-2" />
                    <span className="font-bold text-xl">4.9/5</span>
                    <span className="text-gray-600 ml-2">Student Rating</span>
                  </div>
                  <div className="text-sm text-gray-600">⭐⭐⭐⭐⭐ (2,847 reviews)</div>
                </div>

                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-2xl shadow-xl animate-bounce-gentle z-20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">🎓</div>
                    <div className="text-sm font-medium">Live Classes</div>
                  </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute -z-10 -top-8 -right-8 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -z-10 -bottom-8 -left-8 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233B82F6' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-16c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm16 16c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8zm0-16c0 4.4-3.6 8-8 8s-8-3.6-8-8 3.6-8 8-8 8 3.6 8 8z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 animate-float-up">
              🏆 Trusted by Thousands of Learners
            </h2>
            <p className="text-xl text-gray-600 animate-float-up" style={{animationDelay: '0.2s'}}>
              Join our growing community of successful students
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="feature-card text-center bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 animate-float-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">
                    {index === 0 ? '👥' : index === 1 ? '📚' : index === 2 ? '🎓' : '⭐'}
                  </span>
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-float-up">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-6 py-2 rounded-full mb-6">
              <FaStar className="mr-2" />
              <span className="font-medium">✨ Premium Features</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Platform?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              🎯 We provide comprehensive learning experiences designed to help you succeed in your career with cutting-edge technology and expert guidance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-gray-100 relative overflow-hidden animate-float-up"
                style={{animationDelay: `${index * 0.15}s`}}
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${
                    index === 0 ? 'from-blue-500 to-blue-600' :
                    index === 1 ? 'from-green-500 to-green-600' :
                    index === 2 ? 'from-purple-500 to-purple-600' :
                    'from-orange-500 to-orange-600'
                  } mb-6 transform hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="text-3xl text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  
                  {/* Feature Badge */}
                  <div className="mt-4 inline-block bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {index === 0 ? '🎓 Expert Led' :
                     index === 1 ? '🏆 Certified' :
                     index === 2 ? '👥 Community' :
                     '🚀 Career Ready'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Explore Course Categories
            </h2>
            <p className="text-xl text-gray-600">
              Choose from our three main skill categories to advance your career
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {courseCategories.map((category, index) => (
              <Link 
                key={index} 
                to={category.link}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
              >
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-semibold">{category.courses} Courses</span>
                    <FaArrowRight className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Success stories from our learning community
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of students who have transformed their careers with our courses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <FaCheckCircle className="mr-2" />
              Get Started Free
            </Link>
            <Link 
              to="/courses" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors flex items-center justify-center"
            >
              Browse Courses
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;