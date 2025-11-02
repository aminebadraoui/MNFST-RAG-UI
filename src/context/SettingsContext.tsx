import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface SettingsState {
  apiBaseUrl: string;
  appName: string;
  appVersion: string;
  theme: 'light' | 'dark';
}

type SettingsAction =
  | { type: 'SET_API_BASE_URL'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'LOAD_SETTINGS'; payload: SettingsState };

const initialState: SettingsState = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  appName: import.meta.env.VITE_APP_NAME || 'RAG Chat Dashboard',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  theme: 'dark',
};

const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'SET_API_BASE_URL':
      return { ...state, apiBaseUrl: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'LOAD_SETTINGS':
      return { ...action.payload };
    default:
      return state;
  }
};

interface SettingsContextType extends SettingsState {
  setApiBaseUrl: (url: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  saveSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'LOAD_SETTINGS', payload: { ...initialState, ...settings } });
      } catch (error) {
        console.error('Failed to load settings from localStorage:', error);
      }
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const setApiBaseUrl = (url: string) => {
    dispatch({ type: 'SET_API_BASE_URL', payload: url });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const saveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(state));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...state,
        setApiBaseUrl,
        setTheme,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};