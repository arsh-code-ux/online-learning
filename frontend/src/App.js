import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from './context/AuthContext';
import { initializeSampleCourses } from './utils/initializeSampleCourses';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import TestLogin from './pages/TestLogin';
import Register from './pages/Register';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import PaymentPage from './pages/PaymentPageNew';
import PremiumPaymentPage from './pages/PremiumPaymentPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CurriculumTest from './pages/CurriculumTest';
import VideoTest from './pages/VideoTest';

// Protected Pages
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import CertificatesPage from './pages/CertificatesPage';
import SettingsPage from './pages/SettingsPage';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';

// Other Components
import LoadingSpinner from './components/LoadingSpinner';
import Chatbot from './components/Chatbot';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Route Component (redirects authenticated users)
// const PublicRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (user) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

function App() {
  const location = useLocation();
  
  // Initialize sample courses on app load
  useEffect(() => {
    initializeSampleCourses();
  }, []);
  
  // Hide navbar on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Development Google Client ID with proper origins configured
  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "1030492698153-6vad3dms8kji8ll0burl58o2u7e4dpht.apps.googleusercontent.com";
  
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/curriculum-test" element={<CurriculumTest />} />
          <Route path="/video-test" element={<VideoTest />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          <Route path="/payment" element={<PremiumPaymentPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/test-login" element={<TestLogin />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Auth Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          
          {/* Protected Student Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certificates" 
            element={
              <ProtectedRoute>
                <CertificatesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
      <Chatbot />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;