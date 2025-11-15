import * as React from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChatBubbleLeftIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
  ArrowUpTrayIcon,
  PlayIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { SidebarThemeToggle } from '../ui';

interface SidebarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  current: boolean;
  badge?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen = false,
  setSidebarOpen
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Helper function to check if user has admin role
  const hasAdminRole = (): boolean => {
    return user?.role === 'tenant_admin' || user?.role === 'superadmin';
  };

  // Role-based navigation items
  const getNavigationItems = (): NavigationItem[] => {
    const items: NavigationItem[] = [];

    // Build Category - accessible to all authenticated users
    items.push({
      name: 'Build',
      href: '/chat',
      icon: ChatBubbleLeftIcon,
      current: location.pathname === '/chat' || location.pathname.startsWith('/chat/'),
    });

    // Train Category - only for tenant_admin and superadmin
    if (hasAdminRole()) {
      items.push({
        name: 'Train',
        href: '/train',
        icon: DocumentTextIcon,
        current: location.pathname === '/train',
      });
    }

    // Settings Category - accessible to all authenticated users
    items.push({
      name: 'Settings',
      href: '/settings',
      icon: Cog6ToothIcon,
      current: location.pathname === '/settings',
    });

    // Users Category - only for tenant_admin and superadmin
    if (hasAdminRole()) {
      items.push({
        name: 'Users',
        href: '/users',
        icon: UsersIcon,
        current: location.pathname === '/users',
      });
    }

    // Tenants Category - only for superadmin
    if (user?.role === 'superadmin') {
      items.push({
        name: 'Tenants',
        href: '/tenants',
        icon: BuildingOfficeIcon,
        current: location.pathname === '/tenants',
      });
    }

    return items;
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-dark-bg-quaternary bg-opacity-75" aria-hidden="true"></div>
        </div>
      )}

      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <div className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 h-screen bg-light-bg-primary dark:bg-dark-bg-secondary shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col
        md:translate-x-0 md:relative md:z-auto md:h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-light-border-primary dark:border-dark-border-primary">
          <h1 className="text-lg font-semibold text-light-text-primary dark:text-dark-text-primary">MNFST RAG</h1>
          <button
            className="md:hidden rounded-md p-2 text-light-text-quaternary dark:text-dark-text-quaternary hover:text-light-text-tertiary dark:hover:text-dark-text-tertiary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen?.(false)}
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                    ${item.current
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 shadow-sm'
                      : 'text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary'
                    }
                  `}
                >
                  <ItemIcon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-2 py-2">
            <button
              onClick={handleLogout}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 flex-shrink-0" />
              Logout
            </button>
          </div>

          {/* User info */}
          <div className="flex-shrink-0 flex border-t border-light-border-primary dark:border-dark-border-primary p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">{user?.name}</p>
                <p className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="flex-shrink-0 border-t border-light-border-primary dark:border-dark-border-primary px-2 py-2">
            <SidebarThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile sidebar button */}
      <button
        className={`
          md:hidden fixed top-4 left-4 z-50 rounded-md p-2 text-light-text-quaternary dark:text-dark-text-quaternary hover:text-light-text-tertiary dark:hover:text-dark-text-tertiary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500
          ${sidebarOpen ? 'hidden' : ''}
        `}
        onClick={() => setSidebarOpen?.(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>
    </>
  );
};

export default Sidebar;