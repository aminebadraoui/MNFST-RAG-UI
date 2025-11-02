import React from 'react';

interface MainContentProps {
  children: React.ReactNode;
  className?: string;
  fullHeight?: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ children, className = '', fullHeight = false }) => {
  if (fullHeight) {
    return (
      <main className={`flex-1 overflow-hidden ${className}`}>
        <div className="h-full overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900" tabIndex={0}>
          {children}
        </div>
      </main>
    );
  }

  return (
    <main className={`flex-1 overflow-hidden ${className}`}>
      <div className="h-full overflow-y-auto focus:outline-none bg-gray-50 dark:bg-gray-900" tabIndex={0}>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainContent;