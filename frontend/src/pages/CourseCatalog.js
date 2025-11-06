import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaStar, 
  FaClock, 
  FaUsers,
  FaSearch,
  FaFilter,
  FaGraduationCap,
  FaCertificate,
  FaPlay,
  FaBookOpen,
  FaTrophy,
  FaAward
} from 'react-icons/fa';
import { CourseContext } from '../context/CourseContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './CourseCatalog.css';

// Custom CSS animations
const customStyles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  
  @keyframes shimmer {
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 1s ease-out;
  }
  
  .animate-float {
    animation: float 8s ease-in-out infinite;
    will-change: transform;
  }
  
  .animate-float-delayed {
    animation: float-delayed 6s ease-in-out infinite;
    animation-delay: 3s;
    will-change: transform;
  }
  
  .animate-shimmer {
    animation: shimmer 3s infinite;
    background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%);
    background-size: 800px 104px;
  }
  
  .animate-glow {
    animation: glow 3s ease-in-out infinite;
    will-change: box-shadow;
  }
  
  .course-card-hover:hover {
    transform: translateY(-8px) scale(1.02);
    transition: all 0.3s ease;
    will-change: transform;
  }
  
  .category-card-hover:hover {
    transform: translateY(-4px) scale(1.05);
    transition: all 0.3s ease;
    will-change: transform;
  }
`;

const CourseCatalog = () => {
  const { courses, loading, getAllCourses } = useContext(CourseContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [navigatingCourseId, setNavigatingCourseId] = useState(null);

  // Inject styles only once when component mounts
  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('courses-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'courses-styles';
      styleSheet.type = 'text/css';
      styleSheet.innerText = customStyles;
      document.head.appendChild(styleSheet);
    }
  }, []);

  const categories = [
    { 
      id: 'all', 
      name: 'All Categories', 
      color: 'bg-gray-100 text-gray-700',
      icon: '📚',
      gradient: 'from-gray-500 to-slate-600'
    },
    { 
      id: 'Soft Skills', 
      name: 'Soft Skills', 
      color: 'bg-blue-100 text-blue-700',
      icon: '🗣️',
      gradient: 'from-blue-500 to-indigo-600'
    },
    { 
      id: 'Technical Skills', 
      name: 'Technical Skills', 
      color: 'bg-green-100 text-green-700',
      icon: '💻',
      gradient: 'from-green-500 to-emerald-600'
    },
    { 
      id: 'Analytical Skills', 
      name: 'Analytical Skills', 
      color: 'bg-purple-100 text-purple-700',
      icon: '📊',
      gradient: 'from-purple-500 to-violet-600'
    },
  ];

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'];
  const pricingOptions = ['all', 'free', 'premium'];

  useEffect(() => {
    getAllCourses();
  }, []); // Remove getAllCourses dependency to prevent infinite loops

  // Use useMemo for filtering instead of useEffect to prevent unnecessary re-renders
  const filteredCourses = useMemo(() => {
    if (!courses || !Array.isArray(courses)) return [];
    
    let filtered = [...courses];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => 
        course.level.toLowerCase().includes(selectedLevel.toLowerCase()) ||
        course.level === selectedLevel
      );
    }

    // Filter by pricing
    if (selectedPricing !== 'all') {
      if (selectedPricing === 'free') {
        filtered = filtered.filter(course => course.price === 0);
      } else if (selectedPricing === 'premium') {
        filtered = filtered.filter(course => course.price > 0);
      }
    }

    // Sort courses
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [courses, searchTerm, selectedCategory, selectedLevel, selectedPricing, sortBy]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Soft Skills':
        return 'bg-blue-100 text-blue-700';
      case 'Technical Skills':
        return 'bg-green-100 text-green-700';
      case 'Analytical Skills':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getLevelBadgeColor = (level) => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('beginner')) {
      return 'bg-green-100 text-green-700';
    } else if (lowerLevel.includes('intermediate')) {
      return 'bg-yellow-100 text-yellow-700';
    } else if (lowerLevel.includes('advanced')) {
      return 'bg-red-100 text-red-700';
    } else {
      return 'bg-gray-100 text-gray-700';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedPricing('all');
    setSortBy('popular');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        {/* Simplified Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full animate-float"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 bg-purple-200/20 rounded-full animate-float-delayed"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl">📚</span>
            </div>
            <LoadingSpinner />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🚀 Loading Amazing Courses...
          </h2>
          <p className="text-xl text-gray-600 animate-fade-in-up">
            Preparing your learning journey ✨
          </p>
        </div>
      </div>
    );
  }

  if (!courses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Courses...</h2>
          <p className="text-gray-600">Please wait while we fetch the latest courses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-catalog-container">
      {/* Hero Section */}
      <section className="catalog-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            🎓 Discover Your Path to Excellence
          </h1>
          <p className="hero-subtitle">
            Explore world-class courses designed to transform your skills and accelerate your career growth
          </p>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value" style={{color: 'white'}}>{courses.length}+</span>
              <span className="stat-label" style={{color: 'white'}}>Quality Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-value" style={{color: 'white'}}>10K+</span>
              <span className="stat-label" style={{color: 'white'}}>Active Students</span>
            </div>
            <div className="stat-item">
              <span className="stat-value" style={{color: 'white'}}>98%</span>
              <span className="stat-label" style={{color: 'white'}}>Success Rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Search Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-6 py-2 bg-white rounded-full shadow-md">
              <span className="text-2xl">🔍</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Find Your Perfect Course
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Use our smart filters to discover courses tailored to your needs
            </p>
          </div>
          
          {/* Main Filter Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Enhanced Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  🚀 Search Courses
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search courses, instructors, topics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white group-focus-within:shadow-xl text-gray-900 font-medium placeholder-gray-400"
                  />
                  {searchTerm && (
                    <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-gray-400 hover:text-red-500 transition-colors bg-gray-100 hover:bg-red-50 rounded-full p-2"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  📚 Category
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white font-semibold text-gray-900 cursor-pointer appearance-none"
                    style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  ⚡ Sort By
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white font-semibold text-gray-900 cursor-pointer appearance-none"
                    style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem'}}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="mt-8 pt-8 border-t-2 border-gray-100">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                    <FaFilter className="text-white text-sm" />
                  </div>
                  <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Quick Filters</span>
                </div>

                {/* Level Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 uppercase">Level:</span>
                  <div className="flex gap-2">
                    {levels.map(level => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(level)}
                        className={`px-4 py-2 text-sm font-bold rounded-xl capitalize transition-all transform hover:scale-105 ${
                          selectedLevel === level
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {level === 'all' ? 'All Levels' : level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 uppercase">Price:</span>
                  <div className="flex gap-2">
                    {pricingOptions.map(pricing => (
                      <button
                        key={pricing}
                        onClick={() => setSelectedPricing(pricing)}
                        className={`px-4 py-2 text-sm font-bold rounded-xl capitalize transition-all transform hover:scale-105 ${
                          selectedPricing === pricing
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        {pricing === 'all' ? 'All' : 
                         pricing === 'free' ? '💎 Free' : 
                         pricing === 'premium' ? '⭐ Paid' : pricing}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all' || selectedPricing !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="ml-auto px-6 py-2 text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all transform hover:scale-105 border-2 border-red-200"
                  >
                    🔄 Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">
              Found <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{filteredCourses.length}</span> courses matching your criteria
            </p>
          </div>
        </div>
      </section>

      {/* Quick Category Navigation */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse by Category</h2>
            <p className="text-gray-600">Choose a category to see related courses</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* All Categories Button */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`p-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📚</span>
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">All Categories</div>
                <div className="text-2xl font-bold text-blue-600">{courses?.length || 0}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
            </button>

            {categories.slice(1).map((category, index) => {
              const categoryCount = courses?.filter(course => course.category === category.id).length || 0;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-card-hover p-8 rounded-2xl border-2 transition-all duration-500 transform hover:scale-110 hover:rotate-1 animate-fade-in-up relative overflow-hidden ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-2xl animate-glow'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-xl'
                  }`}
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  {/* Animated Background Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="text-center relative z-10">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.gradient || 'from-blue-500 to-purple-600'} rounded-2xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300 shadow-lg`}>
                      <span className="text-white text-2xl">{category.icon}</span>
                    </div>
                    <div className="font-bold text-gray-900 mb-2 text-lg">{category.name}</div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">{categoryCount}</div>
                    <div className="text-sm text-gray-600">
                      {categoryCount === 1 ? 'Course' : 'Courses'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free Courses Highlight */}
      <section className="py-8 bg-green-50 border-t-2 border-green-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              🆓 Free Courses Available!
            </h2>
            <p className="text-green-700">
              Start learning today with our {courses?.filter(course => course.price === 0).length || 0} completely free courses
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setSelectedPricing('free')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
            >
              <span>🎓</span>
              <span>Browse Free Courses</span>
            </button>
            <button
              onClick={() => {
                setSelectedPricing('free');
                setSelectedCategory('Technical Skills');
              }}
              className="bg-white hover:bg-gray-50 text-green-700 border-2 border-green-600 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Free Tech Courses
            </button>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <FaSearch className="mx-auto text-6xl text-gray-300 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No courses found</h3>
              <p className="text-gray-600 mb-8">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 space-y-2 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory === 'all' 
                      ? 'All Courses' 
                      : selectedCategory
                    }
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                    {searchTerm && ` for "${searchTerm}"`}
                  </p>
                </div>
                
                {/* Active Filters Display */}
                <div className="flex flex-wrap gap-2">
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                      {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {selectedLevel !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      {selectedLevel}
                      <button
                        onClick={() => setSelectedLevel('all')}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {selectedPricing !== 'all' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {selectedPricing}
                      <button
                        onClick={() => setSelectedPricing('all')}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <div className="bg-gray-50 rounded-lg p-8">
                      <FaSearch className="text-4xl text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
                      <p className="text-gray-600 mb-4">
                        Try adjusting your search terms or filters to find what you're looking for.
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedCategory('all');
                          setSelectedLevel('all');
                          setSelectedPricing('all');
                        }}
                        className="btn-primary"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  filteredCourses.map((course, index) => (
                  <div 
                    key={course._id} 
                    className="course-card-hover bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] border border-gray-100 overflow-hidden group animate-fade-in-up"
                    style={{animationDelay: `${Math.min(index * 0.05, 1)}s`}} // Limit max delay to 1s
                  >
                    {/* Course Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={course.image || course.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop&crop=center`}
                        alt={course.title}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-all duration-300"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent group-hover:from-black/40 transition-all duration-300"></div>
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(course.category)}`}>
                          {course.category.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        {course.isPremium ? (
                          <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-full flex items-center gap-1">
                            💎 PREMIUM
                          </span>
                        ) : (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelBadgeColor(course.level)}`}>
                            {course.level}
                          </span>
                        )}
                      </div>
                      {course.price === 0 && (
                        <div className="absolute bottom-4 left-4">
                          <span className="px-2 py-1 text-xs font-bold bg-green-500 text-white rounded-full">
                            FREE
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          <Link to={`/course/${course._id}`}>
                            {course.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* Instructor */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">
                          by <span className="font-medium text-gray-700">{course.instructor}</span>
                        </p>
                      </div>

                      {/* Course Stats */}
                      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="font-medium">{course.rating}</span>
                          </div>
                          <div className="flex items-center">
                            <FaUsers className="mr-1" />
                            <span>{course.enrolledCount}</span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            <span>{course.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between">
                        <div>
                          {course.price === 0 ? (
                            <span className="text-2xl font-bold text-green-600">Free</span>
                          ) : (
                            <div className="flex items-baseline space-x-2">
                              <span className="text-2xl font-bold text-gray-900">
                                ₹{course.price}
                              </span>
                              {course.originalPrice && course.originalPrice > course.price && (
                                <span className="text-sm text-gray-500 line-through">
                                  ₹{course.originalPrice}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            // Debounced/programmatic navigation to avoid blocking the UI
                            if (navigatingCourseId) return; // prevent double clicks
                            setNavigatingCourseId(course._id);
                            // small timeout to allow browser to finish event processing
                            setTimeout(() => {
                              try {
                                navigate(`/course/${course._id}`);
                              } finally {
                                // clear navigating state after navigation attempt
                                setTimeout(() => setNavigatingCourseId(null), 500);
                              }
                            }, 20);
                          }}
                          disabled={navigatingCourseId === course._id}
                          className="btn-primary text-sm px-4 py-2 inline-flex items-center justify-center hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaPlay className="mr-2" />
                          {navigatingCourseId === course._id ? 'Opening…' : 'View Course'}
                        </button>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CourseCatalog;