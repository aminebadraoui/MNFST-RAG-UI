import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface RoleBasedRouteProps {
  roles: UserRole[];
  element: React.ReactElement;
  fallback?: React.ReactElement;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  roles,
  element,
  fallback = <Navigate to="/build" replace />
}) => {
  const { user, isLoading, isInitialized } = useAuth();

  // Show loading spinner while authentication is being restored
  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = roles.includes(user.role);

  if (hasRequiredRole) {
    return element;
  }

  return fallback;
};

export default RoleBasedRoute;