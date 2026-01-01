import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 1. Check if user info exists in "browser memory"
  const user = localStorage.getItem('userInfo');

  // 2. If no user, kick them to Login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. If user exists, let them see the page
  return children;
};

export default ProtectedRoute;