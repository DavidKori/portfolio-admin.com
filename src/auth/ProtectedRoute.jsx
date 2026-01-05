import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loader while checking authentication
  if (loading) {
    return <Loader fullscreen text="Checking authentication..." />;
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render children
  return children;
};

export default ProtectedRoute;
