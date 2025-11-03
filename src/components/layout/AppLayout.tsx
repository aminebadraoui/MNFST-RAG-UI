import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { theme } = useSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if the current route is chat page to apply full height
  const isChatPage = location.pathname === '/chat';

  return (
    <div className={`min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-dark-bg-quaternary bg-opacity-75" aria-hidden="true"></div>
        </div>
      )}

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content - with left padding for fixed sidebar on desktop */}
      <div className="md:pl-64 flex min-h-screen">
        <MainContent fullHeight={isChatPage}>
          {children}
        </MainContent>
      </div>
    </div>
  );
};

export default AppLayout;