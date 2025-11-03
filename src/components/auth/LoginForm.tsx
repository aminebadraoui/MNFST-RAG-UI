import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import DebugLogin from './DebugLogin';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(email, password);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-5">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="bg-light-bg-tertiary/50 dark:bg-dark-bg-tertiary/50 border-light-border-primary dark:border-dark-border-primary text-light-text-primary dark:text-dark-text-primary placeholder-light-text-quaternary dark:placeholder-dark-text-quaternary focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 focus:scale-[1.02]"
        />
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="bg-light-bg-tertiary/50 dark:bg-dark-bg-tertiary/50 border-light-border-primary dark:border-dark-border-primary text-light-text-primary dark:text-dark-text-primary placeholder-light-text-quaternary dark:placeholder-dark-text-quaternary focus:border-primary-500 focus:ring-primary-500 transition-all duration-200 focus:scale-[1.02]"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-light-border-primary dark:border-dark-border-primary rounded bg-light-bg-tertiary dark:bg-dark-bg-tertiary transition-colors"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-light-text-secondary dark:text-dark-text-secondary">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors">
            Forgot your password?
          </a>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-900/50 dark:bg-red-900/70 border border-red-800 dark:border-red-700 p-4 animate-fade-in">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 dark:text-red-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-300 dark:text-red-200">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="w-full py-3 text-base font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          size="lg"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>

      <DebugLogin />
      
      <div className="text-center">
        <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;