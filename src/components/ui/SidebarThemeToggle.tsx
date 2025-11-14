import * as React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const SidebarThemeToggle: React.FC = () => {
  const { theme, setTheme } = useSettings();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-light-text-tertiary dark:text-dark-text-tertiary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors"
      title="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="mr-3 h-5 w-5 flex-shrink-0" />
      ) : (
        <SunIcon className="mr-3 h-5 w-5 flex-shrink-0" />
      )}
      Theme
    </button>
  );
};

export { SidebarThemeToggle };