import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { UserRole } from '../../types';
import { mockAuthAPI } from '../../services/mock/mockAuthAPI';

interface DebugLoginProps {
  className?: string;
}

const DebugLogin: React.FC<DebugLoginProps> = ({ className = '' }) => {
  const { login, isLoading, clearError } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);

  // Only show in development mode when debug login is enabled
  const isDebugMode = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEBUG_LOGIN === 'true';
  
  if (!isDebugMode) {
    return null;
  }

  const handleQuickLogin = async (role: UserRole) => {
    clearError();
    setLoadingRole(role);
    const credentials = mockAuthAPI.getCredentialsByRole(role);
    try {
      await login(credentials.email, credentials.password);
    } finally {
      setLoadingRole(null);
    }
  };

  const roleButtons = [
    { role: 'superadmin' as UserRole, label: 'Super Admin', color: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800' },
    { role: 'tenant_admin' as UserRole, label: 'Tenant Admin', color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' },
    { role: 'user' as UserRole, label: 'User', color: 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' }
  ];

  return (
    <div className={`mt-6 ${className}`}>
      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary hover:text-light-text-tertiary dark:hover:text-dark-text-tertiary transition-colors underline"
        >
          {isExpanded ? 'Hide' : 'Show'} Debug Login Options
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 p-4 bg-dark-bg-tertiary/50 rounded-lg border border-dark-border-primary">
          <p className="text-xs text-dark-text-tertiary mb-3 text-center">
            Quick login for development (uses env credentials):
          </p>
          <div className="space-y-2">
            {roleButtons.map(({ role, label, color }) => (
              <Button
                key={role}
                type="button"
                onClick={() => handleQuickLogin(role)}
                loading={loadingRole === role}
                disabled={isLoading || loadingRole !== null}
                size="sm"
                className={`w-full ${color} text-white transition-all duration-200`}
              >
                Login as {label}
              </Button>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-dark-border-primary">
            <p className="text-xs text-dark-text-quaternary text-center">
              Credentials loaded from environment variables
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugLogin;