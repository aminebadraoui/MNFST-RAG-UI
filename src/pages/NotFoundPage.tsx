import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-light-border-primary dark:border-dark-border-primary">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary">404</h1>
            <p className="mt-2 text-lg text-light-text-secondary dark:text-dark-text-secondary">Page not found</p>
            <p className="mt-4 text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
              The page you're looking for doesn't exist.
            </p>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Go back home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;