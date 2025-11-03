import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ui';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ThemeToggle />
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-900 opacity-20 animate-pulse-slow dark:opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gray-800 opacity-30 animate-pulse-slow dark:opacity-40" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-primary-900 to-gray-800 opacity-10 blur-3xl dark:opacity-20"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 animate-slide-up">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center mb-6 shadow-lg transform transition-all duration-300 hover:scale-110">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2 bg-clip-text text-transparent bg-gradient-to-r from-light-text-primary to-light-text-secondary dark:from-dark-text-primary dark:to-dark-text-secondary">
            RAG Chat Dashboard
          </h2>
          <p className="text-light-text-tertiary dark:text-dark-text-tertiary max-w-sm mx-auto">
            Sign in to manage your chatbot and documents
          </p>
        </div>
        
        <div className="bg-light-bg-secondary/90 dark:bg-dark-bg-secondary/90 backdrop-blur-sm py-8 px-6 shadow-xl rounded-2xl border border-light-border-primary dark:border-dark-border-primary transition-all duration-300 hover:shadow-2xl">
          <LoginForm />
        </div>
        
        <div className="text-center text-sm text-light-text-quaternary dark:text-dark-text-quaternary animate-fade-in">
          <p>© 2024 RAG Chat Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;