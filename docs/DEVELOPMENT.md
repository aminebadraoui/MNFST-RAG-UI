# Development Guide

Comprehensive guide for developing RAG Chat Admin Dashboard, including environment setup, project structure, component patterns, and best practices.

## 🚀 Quick Start

### Prerequisites

| Software | Minimum Version | Recommended Version | Installation |
|----------|------------------|-------------------|-------------|
| **Node.js** | v16.0.0 | v18.0.0 LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | v8.0.0 | v9.0.0 | Included with Node.js |
| **Git** | v2.20.0 | v2.40.0 | [git-scm.com](https://git-scm.com/) |
| **VS Code** | v1.70.0 | v1.85.0 | [code.visualstudio.com](https://code.visualstudio.com/) |

### Optional Tools

| Tool | Purpose | Installation |
|------|---------|-------------|
| **Docker** | Containerization | [docker.com](https://docker.com/) |
| **Postman** | API testing | [postman.com](https://postman.com/) |
| **Chrome DevTools** | Debugging | Built into Chrome |
| **React DevTools** | React debugging | Chrome Extension |

### Installation Steps

1. **Clone the Repository**
```bash
git clone <repository-url>
cd rag-chat-ui
```

2. **Install Dependencies**
```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

3. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env  # or use your preferred editor
```

4. **Start Development Server**
```bash
# Start development server
npm run dev

# Or with specific port
npm run dev -- --port 3000
```

5. **Verify Setup**
Open your browser and navigate to `http://localhost:5173`

## ⚙️ Environment Configuration

### Environment Variables

Create `.env` file with your configuration:

```env
# Application Configuration
VITE_APP_NAME=RAG Chat Dashboard
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=http://localhost:3001/api

# Development Settings
VITE_DEV_MODE=true
VITE_DEBUG_MODE=false

# Mock API Configuration
VITE_USE_MOCK_API=true
VITE_MOCK_DELAY_MIN=500
VITE_MOCK_DELAY_MAX=2000
VITE_MOCK_ERROR_RATE=0.1

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### Environment-Specific Files

Create environment-specific configuration files:

```bash
# Development
.env.development

# Staging
.env.staging

# Production
.env.production
```

### Git Ignore for Environment Files

Ensure `.env.local` files are ignored:

```gitignore
# Environment variables
.env.local
.env.*.local
```

## 🛠️ Development Environment Setup

### Node.js Configuration

#### Install Node.js using Version Manager

**Using NVM (Recommended):**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Set as default
nvm alias default node
```

**Using FNM:**
```bash
# Install FNM
curl -fsSL https://fnm.vercel.app/install | bash

# Reload shell
source ~/.bashrc

# Install Node.js LTS
fnm install --lts
fnm use lts-latest
```

#### Configure npm

```bash
# Set npm registry (if needed)
npm config set registry https://registry.npmjs.org/

# Configure npm cache
npm config set cache ~/.npm-cache

# Set default author
npm config set init-author-name "Your Name"
npm config set init-author-email "your.email@example.com"
```

### Git Configuration

#### Basic Git Setup

```bash
# Configure user identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Configure line endings (Windows)
git config --global core.autocrlf true

# Configure line endings (macOS/Linux)
git config --global core.autocrlf input
```

#### SSH Key Setup

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

Add public key to your GitHub account.

### VS Code Setup

#### Install VS Code

**macOS:**
```bash
# Using Homebrew
brew install --cask visual-studio-code

# Or download from website
# https://code.visualstudio.com/
```

**Windows:**
```bash
# Using Chocolatey
choco install visualstudiocode

# Or download from website
# https://code.visualstudio.com/
```

**Linux (Ubuntu):**
```bash
# Using Snap
sudo snap install code --classic

# Or using APT
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > packages.microsoft.gpg
sudo install -o root -g root -m 644 packages.microsoft.gpg /etc/apt/trusted.gpg.d/
```

#### Recommended Extensions

Install these extensions for best development experience:

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
code --install-extension ms-vscode.vscode-react-native
```

#### VS Code Settings

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

#### VS Code Tasks

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Development Server",
      "type": "npm",
      "script": "dev",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Run Tests",
      "type": "npm",
      "script": "test",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Build for Production",
      "type": "npm",
      "script": "build",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    }
  ]
}
```

#### VS Code Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome against localhost",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    },
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## 📁 Project Structure

### Complete File Structure

```
rag-chat-ui/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── index.ts
│   │   ├── layout/             # Layout components
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── MainContent.tsx
│   │   │   └── index.ts
│   │   ├── auth/               # Authentication components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── index.ts
│   │   ├── chat/               # Chat-related components
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── Message.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── SessionList.tsx
│   │   │   ├── SessionItem.tsx
│   │   │   ├── NewSessionButton.tsx
│   │   │   └── index.ts
│   │   ├── documents/          # Document management components
│   │   │   ├── DocumentUploader.tsx
│   │   │   ├── DocumentList.tsx
│   │   │   ├── DocumentItem.tsx
│   │   │   ├── UploadProgress.tsx
│   │   │   └── index.ts
│   │   ├── social/             # Social media components
│   │   │   ├── SocialMediaForm.tsx
│   │   │   ├── SocialMediaList.tsx
│   │   │   ├── SocialMediaItem.tsx
│   │   │   └── index.ts
│   │   └── settings/           # Settings components
│   │       ├── APIConfig.tsx
│   │       ├── AuthConfig.tsx
│   │       └── index.ts
│   ├── pages/                  # Page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── DocumentsPage.tsx
│   │   ├── SocialPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── useDocuments.ts
│   │   ├── useSocial.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   ├── services/               # API services
│   │   ├── apiClient.ts
│   │   ├── authAPI.ts
│   │   ├── chatAPI.ts
│   │   ├── documentAPI.ts
│   │   ├── socialAPI.ts
│   │   └── index.ts
│   ├── context/                # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── ChatContext.tsx
│   │   ├── DocumentContext.tsx
│   │   ├── SocialContext.tsx
│   │   ├── SettingsContext.tsx
│   │   └── index.ts
│   ├── types/                  # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── chat.ts
│   │   ├── document.ts
│   │   ├── social.ts
│   │   ├── api.ts
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── storage.ts
│   │   └── index.ts
│   ├── styles/                 # Global styles and Tailwind config
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── index.css
│   ├── App.tsx                 # Main App component
│   ├── main.tsx               # Application entry point
│   └── vite-env.d.ts          # Vite type definitions
├── .env.example               # Environment variables example
├── .gitignore                 # Git ignore file
├── index.html                 # HTML template
├── package.json               # Project dependencies
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── README.md                  # Project documentation
```

### Component Dependencies

#### Authentication Flow
```
App.tsx
├── AuthProvider
│   ├── AuthContext
│   └── ProtectedRoute
│       └── LoginPage
│           └── LoginForm
```

#### Main Application Flow
```
AppLayout
├── Header
│   ├── Logo
│   ├── UserMenu
│   └── SettingsButton
├── Sidebar
│   ├── Navigation
│   │   ├── ChatNavItem
│   │   ├── DocumentsNavItem
│   │   ├── SocialNavItem
│   │   └── SettingsNavItem
│   └── SessionList (when on chat page)
│       ├── SessionItem
│       └── NewSessionButton
└── MainContent
    ├── ChatPage
    │   ├── ChatWindow
    │   │   ├── MessageList
    │   │   │   └── Message
    │   │   └── MessageInput
    │   └── SessionManager
    ├── DocumentsPage
    │   ├── DocumentUploader
    │   └── DocumentList
    │       └── DocumentItem
    ├── SocialPage
    │   ├── SocialMediaForm
    │   └── SocialMediaList
    │       └── SocialMediaItem
    └── SettingsPage
        ├── APIConfig
        └── AuthConfig
```

## 🧩 Component Patterns

### State Management Strategy

#### Global State (Context)
- Authentication state (user, tokens)
- Application settings (API endpoints)
- Theme preferences

#### Feature-specific State (Context)
- Chat sessions and messages
- Document uploads and status
- Social media links

#### Local Component State
- Form inputs
- UI states (dropdowns, modals)
- Temporary data

### Reusable Component Patterns

#### Base UI Components

```typescript
// Button Component Example
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <LoadingSpinner size="sm" /> : children}
    </button>
  );
};
```

#### Form Components

```typescript
// Form Input Component
interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false
}) => {
  const inputId = useId();

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
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
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
```

### Custom Hooks Patterns

#### Data Fetching Hook

```typescript
// useApi Hook
interface UseApiOptions<T> {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [apiCall, options]);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [execute, options.immediate]);

  return { data, loading, error, execute };
}
```

#### Local Storage Hook

```typescript
// useLocalStorage Hook
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}
```

## 📏 Code Standards

### File Naming Conventions

#### Components
- PascalCase for component files: `Button.tsx`, `ChatWindow.tsx`
- Index files for exports: `index.ts`
- Group related components in folders

#### Hooks
- CamelCase with 'use' prefix: `useAuth.ts`, `useChat.ts`
- Custom hooks in dedicated hooks folder

#### Services
- CamelCase with 'API' suffix: `authAPI.ts`, `chatAPI.ts`
- Group related API methods in service files

#### Types
- CamelCase for type files: `auth.ts`, `chat.ts`
- Export interfaces and types from index files

#### Utils
- CamelCase for utility files: `helpers.ts`, `validators.ts`
- Group related utility functions

### Import Organization

#### Import Order
1. React and related libraries
2. Third-party libraries
3. Internal components (relative imports)
4. Services and hooks
5. Types and interfaces
6. Utility functions

#### Example
```typescript
import React, { useState, useEffect } from 'react';
import { useRouter } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../services/authAPI';
import { User } from '../../types/auth';
import { formatDate } from '../../utils/formatters';
```

### Code Organization Principles

#### Separation of Concerns
- UI components separate from business logic
- API calls abstracted in service layer
- State management isolated in contexts
- Utility functions reusable across components

#### Reusability
- Generic UI components in `components/ui`
- Feature-specific components in feature folders
- Custom hooks for reusable logic
- Utility functions for common operations

#### Scalability
- Modular structure for easy feature addition
- Clear boundaries between features
- Consistent naming and organization
- Type safety throughout application

## 🧪 Testing Setup

### Jest Configuration

The project uses Jest for testing. Configuration is in `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1'
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Testing Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false"
  }
}
```

### Component Testing Example

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

## 🔧 Development Tools

### ESLint Configuration

`.eslintrc.js`:

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'jsx-a11y'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'off',
    'jsx-a11y/anchor-is-valid': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
};
```

### Prettier Configuration

`.prettierrc`:

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

### Husky Git Hooks

Install and configure Husky for Git hooks:

```bash
# Install Husky
npm install --save-dev husky

# Initialize Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run type-check"

# Add pre-push hook
npx husky add .husky/pre-push "npm run test:ci"
```

### Lint-Staged Configuration

Install and configure lint-staged:

```bash
npm install --save-dev lint-staged
```

`package.json`:

```json
{
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

## 🐳 Docker Development Setup

### Dockerfile for Development

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Docker Compose

`docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_USE_MOCK_API=true
      - VITE_DEV_MODE=true
    command: npm run dev -- --host 0.0.0.0

  # Add other services as needed
  # api:
  #   image: your-api-image
  #   ports:
  #     - "3001:3001"
```

### Running with Docker

```bash
# Build and start containers
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop containers
docker-compose down

# View logs
docker-compose logs -f app
```

## 🔍 Debugging Setup

### Browser DevTools

Enable React DevTools and Redux DevTools:

1. Install React Developer Tools extension
2. Install Redux DevTools extension (if using Redux)
3. Open DevTools in your browser
4. Go to React tab to inspect component hierarchy

### VS Code Debugging

Set up debugging in VS Code:

1. Install React Developer Tools extension
2. Create launch configuration (see above)
3. Set breakpoints in your code
4. Press F5 to start debugging

### Chrome DevTools

Use Chrome DevTools for debugging:

1. Open Developer Tools (F12)
2. Use Console tab for logging
3. Use Network tab for API requests
4. Use Elements tab for DOM inspection
5. Use Performance tab for performance analysis

## 🚀 Common Development Tasks

### Running Application

```bash
# Development mode
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format
```

### Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Building

```bash
# Build for development
npm run build:dev

# Build for production
npm run build

# Build and analyze bundle
npm run build && npm run analyze
```

## 🎯 First Steps with the Application

### Explore the Dashboard

Once the application is running, you'll see:

- **Login Page**: Use `user@example.com` with password `password` (mock credentials)
- **Dashboard**: Overview of all features
- **Chat Interface**: Create and manage chat sessions
- **Document Management**: Upload and manage documents
- **Social Media**: Manage social media links
- **Settings**: Configure API endpoints and preferences

### Try the Features

#### Chat Interface
1. Click on "Chat" in the sidebar
2. Create a new session
3. Send a message and see the streaming response
4. Try different conversation scenarios

#### Document Management
1. Navigate to "Documents"
2. Try uploading a single file
3. Test multiple file uploads
4. Observe the progress tracking
5. Check document processing status

#### Social Media Integration
1. Go to "Social Media" section
2. Add a social media link (e.g., https://twitter.com/example)
3. See automatic platform detection
4. Test removing links

#### Settings
1. Visit the "Settings" page
2. Check API configuration options
3. View authentication status
4. Test connection status indicators

## 🔧 Common Setup Issues

### Port Already in Use

If port 5173 is already in use:

```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or start on a different port
npm run dev -- --port 3000
```

### Dependency Issues

If you encounter dependency conflicts:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

### Environment Variables Not Working

Ensure your `.env` file is in the project root and follows this format:

```env
# No quotes around values
VITE_API_BASE_URL=http://localhost:3001/api
VITE_USE_MOCK_API=true
```

### Hot Reload Not Working

Try these solutions:

1. Check for TypeScript errors
2. Restart development server
3. Ensure file watchers are working
4. Check if your OS limits file watchers

## 📚 Next Steps

- [Architecture Guide](./ARCHITECTURE.md) - System architecture and design
- [API Reference](./API.md) - Complete API documentation
- [Database Schema](./DATABASE.md) - Database structure and types
- [Deployment Guide](./DEPLOYMENT.md) - Deployment instructions

---

**Related Documentation**:
- [Architecture Guide](./ARCHITECTURE.md)
- [API Reference](./API.md)
- [Database Schema](./DATABASE.md)
- [Deployment Guide](./DEPLOYMENT.md)