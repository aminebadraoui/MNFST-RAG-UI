import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { UserRole } from '../../types';
import {
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useSettings();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return { color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200', icon: ShieldCheckIcon, text: 'Superadmin' };
      case 'tenant_admin':
        return { color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200', icon: BuildingOfficeIcon, text: 'Tenant Admin' };
      case 'user':
        return { color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200', icon: UserCircleIcon, text: 'User' };
      default:
        return { color: 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary', icon: UserCircleIcon, text: 'Unknown' };
    }
  };

  const roleBadge = user ? getRoleBadge(user.role) : null;

  return (
    <header className="bg-light-bg-primary dark:bg-dark-bg-secondary shadow-sm border-b border-light-border-primary dark:border-dark-border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-600/30">
                <ChatBubbleLeftIcon className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
                RAG Chat
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {user?.role === 'superadmin' ? (
              <>
                <Link
                  to="/tenants"
                  className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Tenants
                </Link>
                <Link
                  to="/users"
                  className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Users
                </Link>
                <Link
                  to="/settings"
                  className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Settings
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/chat"
                  className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Chat
                </Link>
                {(user?.role === 'tenant_admin') && (
                  <>
                    <Link
                      to="/documents"
                      className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Documents
                    </Link>
                    <Link
                      to="/social"
                      className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Social
                    </Link>
                  </>
                )}
                <Link
                  to="/settings"
                  className="text-light-text-tertiary dark:text-dark-text-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Settings
                </Link>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Role Badge */}
            {roleBadge && (
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge.color}`}>
                <roleBadge.icon className="w-3 h-3 mr-1" aria-hidden="true" />
                {roleBadge.text}
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-light-text-quaternary dark:text-dark-text-quaternary hover:text-light-text-tertiary dark:hover:text-dark-text-tertiary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary rounded-md transition-colors"
              title="Toggle theme"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5" />
              )}
            </button>

            {/* Settings */}
            <Link
              to="/settings"
              className="p-2 text-light-text-quaternary dark:text-dark-text-quaternary hover:text-light-text-tertiary dark:hover:text-dark-text-tertiary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary rounded-md transition-colors"
              title="Settings"
            >
              <Cog6ToothIcon className="h-5 w-5" />
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-600/30">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            className="inline-flex items-center justify-center p-2 rounded-md text-light-text-quaternary dark:text-dark-text-quaternary hover:text-light-text-tertiary dark:hover:text-dark-text-tertiary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {user?.role === 'superadmin' ? (
            <>
              <Link
                to="/tenants"
                className="block px-3 py-2 rounded-md text-base font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
              >
                Tenants
              </Link>
              <Link
                to="/users"
                className="block px-3 py-2 rounded-md text-base font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
              >
                Users
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
              >
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
              >
                Dashboard
              </Link>
              <Link
                to="/chat"
                className="block px-3 py-2 rounded-md text-base font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
              >
                Chat
              </Link>
              {(user?.role === 'tenant_admin') && (
                <>
                  <Link
                    to="/documents"
                    className="block px-3 py-2 rounded-md text-base font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                  >
                    Documents
                  </Link>
                  <Link
                    to="/social"
                    className="block px-3 py-2 rounded-md text-base font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
                  >
                    Social
                  </Link>
                </>
              )}
              <Link
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
              >
                Settings
              </Link>
            </>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-light-border-primary dark:border-dark-border-primary">
          <div className="px-2">
            <div className="text-base font-medium text-light-text-primary dark:text-dark-text-primary">{user?.name}</div>
            <div className="text-sm text-light-text-quaternary dark:text-dark-text-quaternary">{user?.email}</div>
            <button
              onClick={handleLogout}
              className="mt-2 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-600 bg-light-bg-primary dark:bg-dark-bg-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;