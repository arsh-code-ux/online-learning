import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, setAuthToken, clearAuthData, handleApiError } from '../utils/api';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  loading: true,
  isAuthenticated: false,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  LOAD_USER: 'LOAD_USER',
  SET_LOADING: 'SET_LOADING',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case AUTH_ACTIONS.LOAD_USER:
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from localStorage on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Load user function
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setAuthToken(token);
      
      try {
        const response = await authAPI.getProfile();
        
        if (response.data.success) {
          dispatch({
            type: AUTH_ACTIONS.LOAD_USER,
            payload: response.data.user,
          });
          
          // Store user in localStorage
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error('Load user error:', error);
        clearAuthData();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } else {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Set token and store user
        setAuthToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: user,
        });
        
        toast.success(`Welcome back, ${user.firstName}!`);
        return { success: true, user };
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Set token and store user
        setAuthToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: user,
        });
        
        toast.success(`Welcome to our platform, ${user.firstName}!`);
        return { success: true, user };
      }
    } catch (error) {
      console.error('Register error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    clearAuthData();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Logged out successfully');
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        
        dispatch({
          type: AUTH_ACTIONS.UPDATE_USER,
          payload: updatedUser,
        });
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify({ ...state.user, ...updatedUser }));
        
        toast.success('Profile updated successfully');
        return { success: true, user: updatedUser };
      }
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      
      if (response.data.success) {
        toast.success('Password changed successfully');
        return { success: true };
      }
    } catch (error) {
      console.error('Change password error:', error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user && state.user.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Check if user is student
  const isStudent = () => {
    return hasRole('student');
  };

  // Google login function
  const googleLogin = async (credentialResponse) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      // Mock Google login for demo
      const mockUser = {
        _id: 'google_' + Date.now(),
        name: 'Google User',
        email: 'user@gmail.com',
        role: 'student',
        avatar: 'https://via.placeholder.com/150'
      };
      
      const token = 'mock_google_token_' + Date.now();
      
      // Store user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setAuthToken(token);
      
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: mockUser });
      toast.success('Google login successful!');
      
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user: state.user,
    loading: state.loading,
    isAuthenticated: state.isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    loadUser,
    hasRole,
    isAdmin,
    isStudent,
    googleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export { AuthContext };
export default AuthProvider;