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
  fallback = <Navigate to="/chat" replace />
}) => {
  const { user } = useAuth();

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