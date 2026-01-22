import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireUser?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false, 
  requireUser = false 
}) => {
  const { adminUser, isLoggedIn, isAdminLoggedIn } = useApp();

  // If admin access is required
  if (requireAdmin) {
    if (!isAdminLoggedIn || !adminUser) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  }

  // If user access is required (can be either regular user or admin)
  if (requireUser) {
    if (!isLoggedIn && !isAdminLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  }

  // Default: require any authentication
  if (!isLoggedIn && !isAdminLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
