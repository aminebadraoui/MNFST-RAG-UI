import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface RoutePreserverProps {
  children: React.ReactNode;
}

const RoutePreserver: React.FC<RoutePreserverProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isInitialized, isAuthenticated } = useAuth();
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    // Store the current URL when the component mounts
    if (!isInitialized) {
      const currentPath = location.pathname + location.search + location.hash;
      sessionStorage.setItem('intendedRoute', currentPath);
    }
  }, [location, isInitialized]);

  useEffect(() => {
    // Restore the intended route after authentication is initialized
    if (isInitialized && !isRestoring) {
      setIsRestoring(true);
      const intendedRoute = sessionStorage.getItem('intendedRoute');
      
      // Only navigate if we have an intended route that's different from current
      if (intendedRoute && intendedRoute !== (location.pathname + location.search + location.hash)) {
        // Don't navigate to login if user is authenticated
        if (isAuthenticated && !intendedRoute.startsWith('/login')) {
          navigate(intendedRoute, { replace: true });
        } else if (!isAuthenticated && intendedRoute !== '/login') {
          // If not authenticated, keep them on the current page (which will be handled by ProtectedRoute)
          sessionStorage.removeItem('intendedRoute');
        }
      } else {
        sessionStorage.removeItem('intendedRoute');
      }
    }
  }, [isInitialized, isAuthenticated, location, navigate, isRestoring]);

  return <>{children}</>;
};

export default RoutePreserver;