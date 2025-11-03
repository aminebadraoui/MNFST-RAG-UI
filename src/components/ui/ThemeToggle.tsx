import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useSettings();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-full shadow-lg border border-light-border-primary dark:border-dark-border-primary hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      title="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {theme === 'light' ? (
          <MoonIcon className="h-6 w-6 text-light-text-primary dark:text-dark-text-primary transition-all duration-300" />
        ) : (
          <SunIcon className="h-6 w-6 text-light-text-primary dark:text-dark-text-primary transition-all duration-300" />
        )}
      </div>
      <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary text-sm px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      </span>
    </button>
  );
};

export { ThemeToggle };