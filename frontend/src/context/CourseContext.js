import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { courseAPI, enrollmentAPI, handleApiError } from '../utils/api';
import { courseCurriculums } from '../data/courseCurriculum';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  courses: [],
  myCourses: [],
  currentCourse: null,
  loading: false,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    category: '',
    level: '',
    search: '',
    sort: 'newest',
  },
};

// Action types
const COURSE_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_COURSES: 'SET_COURSES',
  SET_MY_COURSES: 'SET_MY_COURSES',
  SET_CURRENT_COURSE: 'SET_CURRENT_COURSE',
  UPDATE_COURSE: 'UPDATE_COURSE',
  ADD_COURSE: 'ADD_COURSE',
  DELETE_COURSE: 'DELETE_COURSE',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  UPDATE_ENROLLMENT: 'UPDATE_ENROLLMENT',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  CLEAR_CURRENT_COURSE: 'CLEAR_CURRENT_COURSE',
};

// Reducer
const courseReducer = (state, action) => {
  switch (action.type) {
    case COURSE_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case COURSE_ACTIONS.SET_COURSES:
      return {
        ...state,
        courses: action.payload,
        loading: false,
      };

    case COURSE_ACTIONS.SET_MY_COURSES:
      return {
        ...state,
        myCourses: action.payload,
        loading: false,
      };

    case COURSE_ACTIONS.SET_CURRENT_COURSE:
      return {
        ...state,
        currentCourse: action.payload,
        loading: false,
      };

    case COURSE_ACTIONS.UPDATE_COURSE:
      return {
        ...state,
        courses: state.courses.map(course =>
          course._id === action.payload._id ? { ...course, ...action.payload } : course
        ),
        currentCourse: state.currentCourse && state.currentCourse._id === action.payload._id
          ? { ...state.currentCourse, ...action.payload }
          : state.currentCourse,
      };

    case COURSE_ACTIONS.ADD_COURSE:
      return {
        ...state,
        courses: [action.payload, ...state.courses],
      };

    case COURSE_ACTIONS.DELETE_COURSE:
      return {
        ...state,
        courses: state.courses.filter(course => course._id !== action.payload),
      };

    case COURSE_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case COURSE_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload,
      };

    case COURSE_ACTIONS.UPDATE_ENROLLMENT:
      return {
        ...state,
        myCourses: state.myCourses.map(enrollment =>
          enrollment.courseId._id === action.payload.courseId
            ? { ...enrollment, ...action.payload }
            : enrollment
        ),
      };

    case COURSE_ACTIONS.UPDATE_PROGRESS:
      return {
        ...state,
        myCourses: state.myCourses.map(enrollment =>
          enrollment.courseId._id === action.payload.courseId
            ? { ...enrollment, ...action.payload }
            : enrollment
        ),
      };

    case COURSE_ACTIONS.CLEAR_CURRENT_COURSE:
      return {
        ...state,
        currentCourse: null,
      };

    default:
      return state;
  }
};

// Create context
const CourseContext = createContext();

// Provider component
export const CourseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  // Fetch all courses
  const fetchCourses = useCallback(async (params = {}) => {
    try {
      dispatch({ type: COURSE_ACTIONS.SET_LOADING, payload: true });
      
      const queryParams = {
        ...state.filters,
        ...params,
      };
      
      const response = await courseAPI.getCourses(queryParams);
      
      if (response.data.success) {
        dispatch({
          type: COURSE_ACTIONS.SET_COURSES,
          payload: response.data.courses,
        });
        
        // Set pagination with default values if not provided
        dispatch({
          type: COURSE_ACTIONS.SET_PAGINATION,
          payload: response.data.pagination || {
            currentPage: 1,
            totalPages: 1,
            totalCourses: response.data.courses?.length || 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        });
      }
    } catch (error) {
      console.error('Fetch courses error:', error);
      
      // Fallback to curriculum data when API fails
      const fallbackCourses = Object.values(courseCurriculums).map((curriculum, index) => ({
        _id: curriculum.courseId,
        id: index + 1,
        title: curriculum.courseTitle,
        description: curriculum.description,
        category: curriculum.isPremium ? 'Premium' : 'Free',
        level: 'All Levels',
        price: curriculum.isPremium ? curriculum.price / 100 : 0,
        originalPrice: curriculum.isPremium ? (curriculum.price * 1.5) / 100 : 0,
        duration: curriculum.totalDuration,
        lessons: curriculum.modules?.length || 0,
        rating: 4.8,
        students: Math.floor(Math.random() * 1000) + 100,
        image: `/api/placeholder/400/300?text=${encodeURIComponent(curriculum.courseTitle)}`,
        instructor: 'Expert Instructor',
        tags: curriculum.isPremium ? ['Premium', 'Advanced', 'Certification'] : ['Free', 'Beginner Friendly'],
        isPremium: curriculum.isPremium || false,
        curriculumData: curriculum
      }));
      
      dispatch({
        type: COURSE_ACTIONS.SET_COURSES,
        payload: fallbackCourses,
      });
      
      dispatch({
        type: COURSE_ACTIONS.SET_PAGINATION,
        payload: {
          currentPage: 1,
          totalPages: 1,
          totalCourses: fallbackCourses.length,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
      
      dispatch({ type: COURSE_ACTIONS.SET_LOADING, payload: false });
    }
  }, [state.filters]);

  // Fetch course by ID
  const fetchCourseById = useCallback(async (id) => {
    try {
      dispatch({ type: COURSE_ACTIONS.SET_LOADING, payload: true });
      
      const response = await courseAPI.getCourse(id);
      
      if (response.data.success) {
        dispatch({
          type: COURSE_ACTIONS.SET_CURRENT_COURSE,
          payload: response.data.course,
        });
        
        return response.data.course;
      }
    } catch (error) {
      console.error('Fetch course by ID error:', error);
      dispatch({ type: COURSE_ACTIONS.SET_LOADING, payload: false });
      toast.error(handleApiError(error));
      return null;
    }
  }, []);

  // Fetch courses by category
  const fetchCoursesByCategory = useCallback(async (category) => {
    try {
      dispatch({ type: COURSE_ACTIONS.SET_LOADING, payload: true });
      
      const response = await courseAPI.getCourses({ category });
      
      if (response.data.success) {
        dispatch({
          type: COURSE_ACTIONS.SET_COURSES,
          payload: response.data.data,
        });
      }
    } catch (error) {
      console.error('Fetch courses by category error:', error);
      dispatch({ type: COURSE_ACTIONS.SET_LOADING, payload: false });
      toast.error(handleApiError(error));
    }
  }, []);

  // Fetch my courses
  const fetchMyCourses = useCallback(async () => {
    try {
      dispatch({ type: COURSE_ACTIONS.SET_LOADING, payload: true });
      
      const response = await enrollmentAPI.getEnrolledCourses();
      
      if (response.data.success) {
        dispatch({
          type: COURSE_ACTIONS.SET_MY_COURSES,
          payload: response.data.data,
        });
      }
    } catch (error) {
      console.error('Fetch my courses error:', error);
      dispatch({ type: COURSE_ACTIONS.SET_LOADING, payload: false });
      toast.error(handleApiError(error));
    }
  }, []);

  // Enroll in course
  const enrollInCourse = async (courseId) => {
    try {
      // Check if this is a premium course and user has paid
      const curriculum = courseCurriculums[courseId];
      if (curriculum && curriculum.isPremium) {
        const premiumCourses = JSON.parse(localStorage.getItem('premiumCourses') || '[]');
        const hasPaid = premiumCourses.includes(courseId);
        
        if (!hasPaid) {
          toast.error('This is a premium course. Please complete payment first!');
          return { success: false, error: 'Payment required for premium course' };
        }
      }
      
      const response = await enrollmentAPI.enrollCourse(courseId);
      
      if (response.data.success) {
        toast.success('Successfully enrolled in course!');
        
        // Refresh my courses
        fetchMyCourses();
        
        return { success: true };
      }
    } catch (error) {
      console.error('Enroll in course error:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update course progress
  const updateProgress = async (courseId, progressData) => {
    try {
      const response = await enrollmentAPI.updateProgress(courseId, progressData);
      
      if (response.data.success) {
        dispatch({
          type: COURSE_ACTIONS.UPDATE_PROGRESS,
          payload: {
            courseId,
            ...progressData,
          },
        });
        
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      console.error('Update progress error:', error);
      toast.error(handleApiError(error));
      return { success: false, error: handleApiError(error) };
    }
  };

  // Check enrollment status
  const checkEnrollment = async (courseId) => {
    try {
      const response = await enrollmentAPI.checkEnrollment(courseId);
      
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Check enrollment error:', error);
      return { isEnrolled: false, enrollment: null };
    }
  };

  // Add course review
  const addReview = async (courseId, reviewData) => {
    try {
      const response = await courseAPI.addReview(courseId, reviewData);
      
      if (response.data.success) {
        toast.success('Review added successfully!');
        
        // Refresh current course to show new rating
        if (state.currentCourse && state.currentCourse._id === courseId) {
          fetchCourseById(courseId);
        }
        
        return { success: true };
      }
    } catch (error) {
      console.error('Add review error:', error);
      toast.error(handleApiError(error));
      return { success: false, error: handleApiError(error) };
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    dispatch({
      type: COURSE_ACTIONS.SET_FILTERS,
      payload: newFilters,
    });
  };

  // Clear current course
  const clearCurrentCourse = () => {
    dispatch({ type: COURSE_ACTIONS.CLEAR_CURRENT_COURSE });
  };

  // Search courses
  const searchCourses = async (searchTerm) => {
    const params = {
      search: searchTerm,
      page: 1,
    };
    
    updateFilters({ search: searchTerm });
    await fetchCourses(params);
  };

  // Get course by ID from state (if already loaded)
  const getCourseFromState = (courseId) => {
    return state.courses.find(course => course._id === courseId) || 
           state.currentCourse;
  };

  // Check if user is enrolled in a course
  const isEnrolledInCourse = (courseId) => {
    return state.myCourses.some(enrollment => 
      enrollment.courseId._id === courseId || enrollment.courseId === courseId
    );
  };

  // Get enrollment for a course
  const getEnrollment = (courseId) => {
    return state.myCourses.find(enrollment => 
      enrollment.courseId._id === courseId || enrollment.courseId === courseId
    );
  };

  const value = {
    // State
    courses: state.courses,
    myCourses: state.myCourses,
    currentCourse: state.currentCourse,
    loading: state.loading,
    pagination: state.pagination,
    filters: state.filters,
    
    // Actions
    fetchCourses,
    getAllCourses: fetchCourses, // Alias for backwards compatibility
    fetchCourseById,
    getCourse: fetchCourseById, // Alias for course detail page
    fetchCoursesByCategory,
    fetchMyCourses,
    enrollInCourse,
    updateProgress,
    checkEnrollment,
    addReview,
    updateFilters,
    clearCurrentCourse,
    searchCourses,
    
    // Utilities
    getCourseFromState,
    isEnrolledInCourse,
    getEnrollment,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

// Custom hook to use course context
export const useCourse = () => {
  const context = useContext(CourseContext);
  
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  
  return context;
};

export { CourseContext };
export default CourseProvider;