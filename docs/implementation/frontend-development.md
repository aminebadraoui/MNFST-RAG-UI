# Frontend Development Guide

Comprehensive guide for React frontend development, including patterns, best practices, and implementation details for the MNFST-RAG Admin Dashboard.

## 🚀 Development Environment Setup

### Prerequisites

| Software | Minimum Version | Recommended Version | Installation |
|----------|------------------|-------------------|-------------|
| **Node.js** | v16.0.0 | v18.0.0 LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | v8.0.0 | v9.0.0 | Included with Node.js |
| **Git** | v2.20.0 | v2.40.0 | [git-scm.com](https://git-scm.com/) |
| **VS Code** | v1.70.0 | v1.85.0 | [code.visualstudio.com/](https://code.visualstudio.com/) |

### VS Code Setup

#### Essential Extensions

```bash
# Install extensions using command line
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
code --install-extension ms-vscode.vscode-json
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension ms-vscode.vscode-jest
```

#### VS Code Configuration

Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "'([^']*)'"],
    ["clsx\\(([^)]*)\\)", "\"([^\"]*)\""],
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["cn\\(([^)]*)\\)", "\"([^\"]*)\""]
  ]
}
```

## 🏗️ Project Structure

### Complete File Organization

```
src/
├── components/              # Reusable UI components
│   ├── ui/                 # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── Toast.tsx
│   │   └── index.ts
│   ├── layout/             # Layout components
│   │   ├── AppLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MainContent.tsx
│   │   └── index.ts
│   ├── auth/               # Authentication components
│   │   ├── LoginForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── index.ts
│   ├── chat/               # Chat-related components
│   │   ├── ChatWindow.tsx
│   │   ├── Message.tsx
│   │   ├── MessageInput.tsx
│   │   ├── SessionList.tsx
│   │   ├── SessionItem.tsx
│   │   ├── NewSessionButton.tsx
│   │   └── index.ts
│   ├── documents/          # Document management components
│   │   ├── DocumentUploader.tsx
│   │   ├── DocumentList.tsx
│   │   ├── DocumentItem.tsx
│   │   ├── UploadProgress.tsx
│   │   └── index.ts
│   ├── social/             # Social media components
│   │   ├── SocialMediaForm.tsx
│   │   ├── SocialMediaList.tsx
│   │   ├── SocialMediaItem.tsx
│   │   └── index.ts
│   └── settings/           # Settings components
│       ├── APIConfig.tsx
│       ├── AuthConfig.tsx
│       └── index.ts
├── pages/                  # Page components
│   ├── LoginPage.tsx
│   ├── ChatPage.tsx
│   ├── DocumentsPage.tsx
│   ├── SocialPage.tsx
│   ├── SettingsPage.tsx
│   ├── TenantsPage.tsx
│   ├── UsersPage.tsx
│   └── NotFoundPage.tsx
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useChat.ts
│   ├── useDocuments.ts
│   ├── useSocial.ts
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── index.ts
├── services/               # API services
│   ├── apiClient.ts
│   ├── authAPI.ts
│   ├── chatAPI.ts
│   ├── documentAPI.ts
│   ├── socialAPI.ts
│   └── index.ts
├── context/                # React contexts
│   ├── AuthContext.tsx
│   ├── ChatContext.tsx
│   ├── DocumentContext.tsx
│   ├── SocialContext.tsx
│   ├── SettingsContext.tsx
│   └── index.ts
├── types/                  # TypeScript type definitions
│   ├── auth.ts
│   ├── chat.ts
│   ├── document.ts
│   ├── social.ts
│   ├── api.ts
│   └── index.ts
├── utils/                  # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   ├── validators.ts
│   ├── formatters.ts
│   ├── storage.ts
│   └── index.ts
├── styles/                 # Global styles and Tailwind config
│   ├── globals.css
│   ├── components.css
│   └── index.css
├── App.tsx                 # Main App component
├── main.tsx               # Application entry point
└── vite-env.d.ts          # Vite type definitions
```

## 🧩 Component Development Patterns

### Component Structure Template

```typescript
// Component template with best practices
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useAuth } from '@hooks/useAuth';
import { User } from '@types/auth';
import { formatDate } from '@utils/formatters';
import './ComponentName.css'; // Only if needed

interface ComponentNameProps {
  /** Prop description */
  propName: string;
  /** Optional prop with default */
  optionalProp?: number;
  /** Callback function */
  onAction?: (data: any) => void;
  /** Children content */
  children?: React.ReactNode;
}

/**
 * Component description - what it does and when to use it
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  propName,
  optionalProp = 0,
  onAction,
  children,
}) => {
  // State management
  const [state, setState] = useState(initialState);
  
  // Hooks
  const { user } = useAuth();
  
  // Memoized callbacks
  const handleClick = useCallback((data: any) => {
    onAction?.(data);
  }, [onAction]);
  
  // Effects
  useEffect(() => {
    // Side effects here
    return () => {
      // Cleanup if needed
    };
  }, [propName]);
  
  // Conditional rendering
  if (!propName) {
    return <div>Required prop missing</div>;
  }
  
  return (
    <div className="component-name">
      <h2>{propName}</h2>
      <Button onClick={handleClick}>Action</Button>
      {children}
    </div>
  );
};

export default ComponentName;
```

### Reusable UI Components

#### Button Component

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
};
```

#### Form Input Component

```typescript
interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
}) => {
  const inputId = useId();

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

## 🎣 Custom Hooks Development

### Data Fetching Hook

```typescript
interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retry?: number;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
      setRetryCount(0); // Reset retry count on success
    } catch (err) {
      const error = err as Error;
      
      // Retry logic
      if (retryCount < (options.retry || 0)) {
        setRetryCount(prev => prev + 1);
        setTimeout(execute, 1000 * Math.pow(2, retryCount)); // Exponential backoff
        return;
      }
      
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [apiCall, options, retryCount]);

  const refetch = useCallback(async () => {
    setRetryCount(0);
    await execute();
  }, [execute]);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [execute, options.immediate]);

  return { data, loading, error, execute, refetch };
}
```

### Local Storage Hook

```typescript
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Get from local storage or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback((value: T) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}
```

### Debounce Hook

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## 🔄 State Management Patterns

### Context Pattern

```typescript
// Generic context pattern
interface createContextOptions<T> {
  displayName: string;
  defaultValue: T;
}

export function createContext<T>({ displayName, defaultValue }: createContextOptions<T>) {
  const Context = React.createContext<T>(defaultValue);
  Context.displayName = displayName;

  const Provider = ({ children, value }: { children: React.ReactNode; value: T }) => (
    <Context.Provider value={value}>{children}</Context.Provider>
  );

  const useContext = () => {
    const context = React.useContext(Context);
    if (context === defaultValue) {
      throw new Error(`use${displayName} must be used within a ${displayName}Provider`);
    }
    return context;
  };

  return { Context, Provider, useContext: useContext as () => T };
}

// Usage example
const { Provider: AuthProvider, useContext: useAuthContext } = createContext({
  displayName: 'Auth',
  defaultValue: {
    user: null,
    login: async () => {},
    logout: () => {},
  },
});
```

### Reducer Pattern

```typescript
// Generic reducer pattern
type ReducerAction<T> = {
  type: string;
  payload?: T;
};

type ReducerState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

function createReducer<T>() {
  return (state: ReducerState<T>, action: ReducerAction<T>): ReducerState<T> => {
    switch (action.type) {
      case 'LOADING':
        return { ...state, loading: true, error: null };
      case 'SUCCESS':
        return { ...state, loading: false, data: action.payload };
      case 'ERROR':
        return { ...state, loading: false, error: action.payload };
      case 'RESET':
        return { data: null, loading: false, error: null };
      default:
        return state;
    }
  };
}

// Usage
const chatReducer = createReducer<ChatSession[]>();
```

## 🎨 Styling Patterns

### Tailwind CSS Patterns

#### Consistent Spacing

```typescript
// Spacing utilities
const spacing = {
  xs: 'p-2 m-1',
  sm: 'p-4 m-2',
  md: 'p-6 m-4',
  lg: 'p-8 m-6',
  xl: 'p-12 m-8',
};

// Usage
<div className={`${spacing.md} bg-white rounded-lg shadow-md`}>
  Content
</div>
```

#### Responsive Design

```typescript
// Responsive utilities
const responsive = {
  card: 'w-full md:w-1/2 lg:w-1/3',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  text: 'text-sm md:text-base lg:text-lg',
};

// Usage
<div className={responsive.grid}>
  {items.map(item => (
    <div key={item.id} className={responsive.card}>
      <h3 className={responsive.text}>{item.title}</h3>
    </div>
  ))}
</div>
```

#### Dark Mode Support

```typescript
// Dark mode utilities
const theme = {
  background: 'bg-white dark:bg-gray-900',
  text: 'text-gray-900 dark:text-gray-100',
  border: 'border-gray-200 dark:border-gray-700',
  card: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
};

// Usage
<div className={`${theme.card} p-4 rounded-lg`}>
  <h2 className={theme.text}>Title</h2>
</div>
```

### CSS-in-JS with Tailwind

```typescript
// Dynamic styling with clsx
import clsx from 'clsx';

const Button = ({ variant, size, className, ...props }) => {
  const baseClasses = 'font-medium rounded-md transition-colors';
  
  const variantClasses = clsx({
    'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
    'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
    'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
  });
  
  const sizeClasses = clsx({
    'px-3 py-1.5 text-sm': size === 'sm',
    'px-4 py-2 text-base': size === 'md',
    'px-6 py-3 text-lg': size === 'lg',
  });

  return (
    <button
      className={clsx(baseClasses, variantClasses, sizeClasses, className)}
      {...props}
    />
  );
};
```

## 🧪 Testing Patterns

### Component Testing

```typescript
// Component testing template
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '@context/AuthContext';
import { ComponentName } from './ComponentName';

// Test utilities
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      {ui}
    </AuthProvider>
  );
};

// Mock hooks
jest.mock('@hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true,
  }),
}));

describe('ComponentName', () => {
  const defaultProps = {
    propName: 'test',
    onAction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    renderWithProviders(<ComponentName {...defaultProps} />);
    
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', () => {
    renderWithProviders(<ComponentName {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(defaultProps.onAction).toHaveBeenCalledTimes(1);
  });

  it('handles loading state correctly', async () => {
    renderWithProviders(<ComponentName {...defaultProps} loading />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('displays error message when provided', () => {
    renderWithProviders(<ComponentName {...defaultProps} error="Test error" />);
    
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('handles async operations correctly', async () => {
    renderWithProviders(<ComponentName {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(defaultProps.onAction).toHaveBeenCalledWith('test-data');
    });
  });
});
```

### Hook Testing

```typescript
// Hook testing with renderHook
import { renderHook, act } from '@testing-library/react';
import { useApi } from './useApi';

// Mock API
const mockApiCall = jest.fn();

describe('useApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useApi(mockApiCall));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful API call', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockApiCall.mockResolvedValue(mockData);

    const { result } = renderHook(() => useApi(mockApiCall));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle API error', async () => {
    const mockError = new Error('API Error');
    mockApiCall.mockRejectedValue(mockError);

    const { result } = renderHook(() => useApi(mockApiCall));

    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(mockError);
  });
});
```

## 🚀 Performance Optimization

### Code Splitting

```typescript
// Route-based code splitting
import { lazy, Suspense } from 'react';
import { PageLoader } from '@components/ui/PageLoader';

const ChatPage = lazy(() => import('@pages/ChatPage'));
const DocumentsPage = lazy(() => import('@pages/DocumentsPage'));
const SocialPage = lazy(() => import('@pages/SocialPage'));

const routes = [
  {
    path: '/chat',
    element: (
      <Suspense fallback={<PageLoader />}>
        <ChatPage />
      </Suspense>
    ),
  },
  {
    path: '/documents',
    element: (
      <Suspense fallback={<PageLoader />}>
        <DocumentsPage />
      </Suspense>
    ),
  },
];

// Component-based code splitting
const HeavyComponent = lazy(() => import('@components/HeavyComponent'));

const App = () => {
  const [showHeavy, setShowHeavy] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowHeavy(true)}>
        Load Heavy Component
      </Button>
      {showHeavy && (
        <Suspense fallback={<PageLoader />}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
};
```

### Memoization

```typescript
// Component memoization
const Message = React.memo(({ message, onEdit, onDelete }) => {
  return (
    <div className="message">
      <p>{message.content}</p>
      <div className="message-actions">
        <Button onClick={() => onEdit(message.id)}>Edit</Button>
        <Button onClick={() => onDelete(message.id)}>Delete</Button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content
  );
});

// Hook memoization
const useExpensiveCalculation = (data) => {
  return useMemo(() => {
    // Expensive calculation here
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);
};

// Callback memoization
const useChatHandlers = (sessionId) => {
  const sendMessage = useCallback((content) => {
    // Send message logic
    chatAPI.sendMessage(sessionId, content);
  }, [sessionId]);

  const deleteSession = useCallback(() => {
    // Delete session logic
    chatAPI.deleteSession(sessionId);
  }, [sessionId]);

  return { sendMessage, deleteSession };
};
```

## 🔧 Development Tools

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'jsx-a11y',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'prefer-const': 'error',
    'no-var': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

### Git Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:ci"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,md}": [
      "prettier --write"
    ]
  }
}
```

## 🎯 Best Practices

### Code Organization

1. **Feature-based structure** - Group related files together
2. **Consistent naming** - Use descriptive, consistent names
3. **Index files** - Use index files for clean imports
4. **Type safety** - Use TypeScript throughout
5. **Separation of concerns** - Keep UI, logic, and data separate

### Performance

1. **Lazy loading** - Load code only when needed
2. **Memoization** - Prevent unnecessary re-renders
3. **Optimistic updates** - Update UI before API response
4. **Virtual scrolling** - For large lists
5. **Image optimization** - Use appropriate image formats and sizes

### Accessibility

1. **Semantic HTML** - Use appropriate HTML elements
2. **ARIA labels** - Add accessibility attributes
3. **Keyboard navigation** - Ensure keyboard accessibility
4. **Color contrast** - Ensure sufficient contrast
5. **Screen reader support** - Test with screen readers

### Security

1. **Input validation** - Validate all user inputs
2. **XSS prevention** - Sanitize user content
3. **CSRF protection** - Use CSRF tokens
4. **Secure storage** - Use secure storage for sensitive data
5. **HTTPS** - Always use HTTPS in production

---

## 📚 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Compiler](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

### Community
- [React Community](https://react.dev/community)
- [TypeScript Community](https://www.typescriptlang.org/community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react+typescript)

---

**Related Documentation**:
- [Frontend Architecture](../architecture/frontend-architecture.md) - High-level architecture
- [API Integration](./api-integration.md) - API usage and integration
- [State Management](./state-management.md) - State management patterns
- [Styling & Design System](./styling-design-system.md) - Styling approach