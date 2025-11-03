# Project Structure Reference

Complete reference for the RAG Chat Admin Dashboard project structure, file organization, and naming conventions.

## 📁 Root Directory Structure

```
rag-chat-ui/
├── docs/                       # Documentation
├── public/                     # Static assets
├── src/                        # Source code
├── .env.example                # Environment variables template
├── .gitignore                 # Git ignore file
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── tsconfig.node.json         # TypeScript Node configuration
├── vite.config.ts             # Vite configuration
└── README.md                  # Project documentation
```

## 📚 Documentation Structure

```
docs/
├── README.md                          # Main documentation index
├── getting-started/                   # Getting started guides
│   ├── quick-start.md                # Quick start guide
│   ├── development-setup.md           # Development environment setup
│   ├── installation.md               # Installation instructions
│   └── configuration.md             # Configuration guide
├── architecture/                      # Architecture documentation
│   ├── system-architecture.md       # System architecture overview
│   ├── frontend-architecture.md     # Frontend architecture
│   ├── database-schema.md           # Database schema
│   └── component-architecture.md   # Component architecture
├── implementation/                   # Implementation guides
│   ├── frontend-development.md      # Frontend development
│   ├── api-integration.md          # API integration
│   ├── auth-implementation.md      # Authentication implementation
│   ├── state-management.md         # State management
│   ├── styling-design-system.md     # Styling and design system
│   └── build-deployment.md        # Build and deployment
├── api/                             # API documentation
│   ├── overview.md                  # API overview
│   ├── mock-api.md                 # Mock API documentation
│   └── backend-contract.md          # Backend contract
├── reference/                       # Reference materials
│   ├── project-structure.md         # Project structure (this file)
│   ├── development-workflow.md      # Development workflow
│   ├── troubleshooting.md          # Troubleshooting guide
│   └── faq.md                     # FAQ
└── frontend/                         # Frontend-specific docs (legacy)
    ├── README.md
    ├── getting-started/
    ├── architecture/
    └── implementation/
```

## 🎨 Source Code Structure

### Complete File Organization

```
src/
├── components/                      # Reusable UI components
│   ├── index.ts                   # Component exports
│   ├── ui/                        # Base UI components
│   │   ├── index.ts              # UI component exports
│   │   ├── Button.tsx            # Button component
│   │   ├── Input.tsx             # Input component
│   │   ├── Modal.tsx             # Modal component
│   │   ├── Dropdown.tsx          # Dropdown component
│   │   ├── LoadingSpinner.tsx     # Loading spinner
│   │   ├── Toast.tsx             # Toast notification
│   │   ├── Card.tsx              # Card component
│   │   ├── Badge.tsx             # Badge component
│   │   └── Tabs.tsx              # Tabs component
│   ├── layout/                    # Layout components
│   │   ├── index.ts              # Layout component exports
│   │   ├── AppLayout.tsx          # Main application layout
│   │   ├── Header.tsx            # Header component
│   │   ├── Sidebar.tsx           # Sidebar component
│   │   ├── MainContent.tsx       # Main content area
│   │   ├── Footer.tsx            # Footer component
│   │   └── Navigation.tsx        # Navigation component
│   ├── auth/                      # Authentication components
│   │   ├── index.ts              # Auth component exports
│   │   ├── LoginForm.tsx          # Login form
│   │   ├── ProtectedRoute.tsx     # Route protection
│   │   ├── RoleBasedRoute.tsx     # Role-based routing
│   │   ├── RegisterForm.tsx       # Registration form
│   │   └── ForgotPasswordForm.tsx # Forgot password form
│   ├── chat/                      # Chat-related components
│   │   ├── index.ts              # Chat component exports
│   │   ├── ChatWindow.tsx         # Chat interface
│   │   ├── Message.tsx            # Message component
│   │   ├── MessageInput.tsx       # Message input
│   │   ├── SessionList.tsx        # Chat session list
│   │   ├── SessionItem.tsx        # Session item
│   │   ├── NewSessionButton.tsx   # New session button
│   │   ├── MessageList.tsx        # Message list
│   │   └── TypingIndicator.tsx    # Typing indicator
│   ├── documents/                 # Document management components
│   │   ├── index.ts              # Document component exports
│   │   ├── DocumentUploader.tsx    # Document uploader
│   │   ├── DocumentList.tsx       # Document list
│   │   ├── DocumentItem.tsx       # Document item
│   │   ├── UploadProgress.tsx      # Upload progress
│   │   ├── DocumentPreview.tsx     # Document preview
│   │   ├── FileDropzone.tsx       # File dropzone
│   │   └── DocumentStatus.tsx     # Document status
│   ├── social/                    # Social media components
│   │   ├── index.ts              # Social component exports
│   │   ├── SocialMediaForm.tsx     # Social media form
│   │   ├── SocialMediaList.tsx     # Social media list
│   │   ├── SocialMediaItem.tsx     # Social media item
│   │   ├── PlatformIcon.tsx       # Platform icon
│   │   └── LinkPreview.tsx        # Link preview
│   ├── settings/                  # Settings components
│   │   ├── index.ts              # Settings component exports
│   │   ├── APIConfig.tsx          # API configuration
│   │   ├── AuthConfig.tsx         # Authentication config
│   │   ├── ThemeConfig.tsx        # Theme configuration
│   │   ├── UserSettings.tsx       # User settings
│   │   └── SystemSettings.tsx     # System settings
│   ├── tenants/                   # Tenant management components
│   │   ├── index.ts              # Tenant component exports
│   │   ├── TenantList.tsx         # Tenant list
│   │   ├── TenantItem.tsx         # Tenant item
│   │   ├── TenantForm.tsx         # Tenant form
│   │   ├── TenantStats.tsx        # Tenant statistics
│   │   └── TenantSelector.tsx     # Tenant selector
│   ├── users/                     # User management components
│   │   ├── index.ts              # User component exports
│   │   ├── UserList.tsx           # User list
│   │   ├── UserItem.tsx           # User item
│   │   ├── UserForm.tsx           # User form
│   │   ├── UserProfile.tsx        # User profile
│   │   └── UserStats.tsx          # User statistics
│   └── common/                    # Common components
│       ├── index.ts              # Common component exports
│       ├── ErrorBoundary.tsx      # Error boundary
│       ├── PageLoader.tsx        # Page loader
│       ├── EmptyState.tsx        # Empty state
│       ├── SearchBox.tsx         # Search box
│       ├── Pagination.tsx        # Pagination
│       └── ConfirmDialog.tsx     # Confirmation dialog
├── pages/                           # Page components
│   ├── index.ts                   # Page exports
│   ├── LoginPage.tsx              # Login page
│   ├── ChatPage.tsx               # Chat page
│   ├── DocumentsPage.tsx           # Documents page
│   ├── SocialPage.tsx              # Social media page
│   ├── SettingsPage.tsx            # Settings page
│   ├── TenantsPage.tsx            # Tenants page
│   ├── UsersPage.tsx              # Users page
│   ├── NotFoundPage.tsx            # 404 page
│   ├── ServerErrorPage.tsx         # 500 page
│   └── UnauthorizedPage.tsx       # 403 page
├── hooks/                           # Custom React hooks
│   ├── index.ts                   # Hook exports
│   ├── useAuth.ts                 # Authentication hook
│   ├── useChat.ts                # Chat hook
│   ├── useDocuments.ts            # Documents hook
│   ├── useSocial.ts              # Social media hook
│   ├── useTenants.ts             # Tenants hook
│   ├── useUsers.ts               # Users hook
│   ├── useLocalStorage.ts        # Local storage hook
│   ├── useDebounce.ts           # Debounce hook
│   ├── useThrottle.ts           # Throttle hook
│   ├── useOnClickOutside.ts      # Click outside hook
│   ├── useKeyboard.ts           # Keyboard hook
│   ├── useMediaQuery.ts         # Media query hook
│   ├── usePrevious.ts           # Previous value hook
│   ├── useToggle.ts             # Toggle hook
│   └── useApi.ts               # API hook
├── services/                        # API services
│   ├── index.ts                   # Service exports
│   ├── apiClient.ts               # API client
│   ├── apiServiceFactory.ts       # API service factory
│   ├── authAPI.ts                # Authentication API
│   ├── chatAPI.ts                # Chat API
│   ├── documentAPI.ts            # Document API
│   ├── socialAPI.ts              # Social media API
│   ├── tenantAPI.ts              # Tenant API
│   ├── userAPI.ts                # User API
│   └── mock/                     # Mock API services
│       ├── index.ts              # Mock service exports
│       ├── mockApiClient.ts       # Mock API client
│       ├── mockAuthAPI.ts         # Mock auth API
│       ├── mockChatAPI.ts         # Mock chat API
│       ├── mockDocumentAPI.ts     # Mock document API
│       ├── mockSocialAPI.ts       # Mock social API
│       ├── mockTenantAPI.ts       # Mock tenant API
│       ├── mockUserAPI.ts         # Mock user API
│       ├── mockConfig.ts          # Mock configuration
│       └── mockDataGenerator.ts   # Mock data generator
├── context/                         # React contexts
│   ├── index.ts                   # Context exports
│   ├── AuthContext.tsx            # Authentication context
│   ├── ChatContext.tsx            # Chat context
│   ├── DocumentContext.tsx        # Document context
│   ├── SocialContext.tsx          # Social media context
│   ├── TenantContext.tsx          # Tenant context
│   ├── UserContext.tsx            # User context
│   ├── SettingsContext.tsx        # Settings context
│   └── NotificationContext.tsx    # Notification context
├── types/                           # TypeScript type definitions
│   ├── index.ts                   # Type exports
│   ├── auth.ts                    # Authentication types
│   ├── chat.ts                    # Chat types
│   ├── document.ts                # Document types
│   ├── social.ts                  # Social media types
│   ├── tenant.ts                  # Tenant types
│   ├── user.ts                    # User types
│   ├── api.ts                     # API types
│   ├── common.ts                  # Common types
│   └── index.d.ts                # Global type declarations
├── utils/                           # Utility functions
│   ├── index.ts                   # Utility exports
│   ├── constants.ts               # Application constants
│   ├── helpers.ts                 # Helper functions
│   ├── validators.ts              # Validation functions
│   ├── formatters.ts              # Formatting functions
│   ├── storage.ts                 # Storage utilities
│   ├── date.ts                    # Date utilities
│   ├── string.ts                  # String utilities
│   ├── array.ts                   # Array utilities
│   ├── object.ts                  # Object utilities
│   ├── api.ts                     # API utilities
│   ├── auth.ts                    # Auth utilities
│   ├── file.ts                    # File utilities
│   └── url.ts                     # URL utilities
├── styles/                          # Global styles
│   ├── index.css                  # Main styles
│   ├── globals.css                # Global styles
│   ├── components.css             # Component styles
│   ├── utilities.css              # Utility styles
│   └── variables.css             # CSS variables
├── assets/                          # Static assets
│   ├── images/                   # Image assets
│   │   ├── logo.svg             # Application logo
│   │   ├── favicon.ico          # Favicon
│   │   └── icons/               # Icon assets
│   ├── fonts/                    # Font assets
│   └── icons/                    # Icon assets
├── App.tsx                          # Main App component
├── main.tsx                         # Application entry point
└── vite-env.d.ts                    # Vite type definitions
```

## 📝 File Naming Conventions

### Components

#### Component Files
- **PascalCase** for component names: `Button.tsx`, `ChatWindow.tsx`
- **Descriptive names**: `DocumentUploader.tsx` (not `DocUpload.tsx`)
- **Index files**: `index.ts` for clean imports

#### Component Structure
```typescript
// Button/Button.tsx
export const Button = () => { ... };

// Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

### Hooks

#### Hook Files
- **camelCase** with 'use' prefix: `useAuth.ts`, `useChat.ts`
- **Descriptive names**: `useLocalStorage.ts` (not `useStorage.ts`)
- **Single responsibility**: One hook per file when possible

#### Hook Structure
```typescript
// useAuth.ts
export const useAuth = () => { ... };
export type { AuthState } from './types';
```

### Services

#### Service Files
- **camelCase** with 'API' suffix: `authAPI.ts`, `chatAPI.ts`
- **Descriptive names**: `documentAPI.ts` (not `docAPI.ts`)
- **Mock files**: `mock` prefix: `mockAuthAPI.ts`

#### Service Structure
```typescript
// authAPI.ts
export const authAPI = {
  login: async () => { ... },
  logout: async () => { ... },
};

// index.ts
export { authAPI } from './authAPI';
export { chatAPI } from './chatAPI';
```

### Types

#### Type Files
- **camelCase**: `auth.ts`, `chat.ts`, `document.ts`
- **Descriptive names**: `userProfile.ts` (not `userProf.ts`)
- **Group related types**: All auth types in `auth.ts`

#### Type Structure
```typescript
// auth.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// index.ts
export type { User, AuthState } from './auth';
```

### Utils

#### Utility Files
- **camelCase**: `helpers.ts`, `validators.ts`, `formatters.ts`
- **Descriptive names**: `dateUtils.ts` (not `date.ts`)
- **Group related functions**: All date utilities in one file

#### Utility Structure
```typescript
// dateUtils.ts
export const formatDate = (date: Date) => { ... };
export const isToday = (date: Date) => { ... };

// index.ts
export * from './dateUtils';
export * from './stringUtils';
```

## 🏗️ Import Organization

### Import Order

1. **React and related libraries**
2. **Third-party libraries**
3. **Internal components** (relative imports)
4. **Services and hooks**
5. **Types and interfaces**
6. **Utility functions**

### Import Examples

```typescript
// 1. React and related libraries
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 2. Third-party libraries
import axios from 'axios';
import { clsx } from 'clsx';
import { format } from 'date-fns';

// 3. Internal components
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { ChatWindow } from '@components/chat/ChatWindow';

// 4. Services and hooks
import { useAuth } from '@hooks/useAuth';
import { chatAPI } from '@services/chatAPI';
import { authAPI } from '@services/authAPI';

// 5. Types and interfaces
import { User } from '@types/auth';
import { ChatSession } from '@types/chat';
import { Document } from '@types/document';

// 6. Utility functions
import { formatDate } from '@utils/formatters';
import { validateEmail } from '@utils/validators';
```

### Path Aliases

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': resolve(__dirname, './src'),
    '@components': resolve(__dirname, './src/components'),
    '@pages': resolve(__dirname, './src/pages'),
    '@services': resolve(__dirname, './src/services'),
    '@hooks': resolve(__dirname, './src/hooks'),
    '@types': resolve(__dirname, './src/types'),
    '@utils': resolve(__dirname, './src/utils'),
    '@context': resolve(__dirname, './src/context'),
    '@styles': resolve(__dirname, './src/styles'),
    '@assets': resolve(__dirname, './src/assets'),
  },
},
```

## 📁 Directory Organization Principles

### 1. Feature-Based Structure

Group related files together by feature:

```
src/
├── components/
│   ├── auth/           # All auth-related components
│   ├── chat/           # All chat-related components
│   └── documents/      # All document-related components
├── hooks/
│   ├── useAuth.ts      # Auth hook
│   ├── useChat.ts      # Chat hook
│   └── useDocuments.ts # Documents hook
└── services/
    ├── authAPI.ts      # Auth API
    ├── chatAPI.ts      # Chat API
    └── documentAPI.ts  # Document API
```

### 2. Shared vs Feature-Specific

```
src/
├── components/
│   ├── ui/             # Shared UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   ├── auth/           # Auth-specific components
│   └── chat/           # Chat-specific components
├── hooks/
│   ├── useLocalStorage.ts  # Shared hook
│   ├── useAuth.ts         # Auth-specific hook
│   └── useChat.ts         # Chat-specific hook
└── utils/
    ├── helpers.ts         # Shared utilities
    ├── authUtils.ts       # Auth-specific utilities
    └── chatUtils.ts       # Chat-specific utilities
```

### 3. Index Files for Clean Imports

Use index files to group exports:

```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
export type { ButtonProps } from './Button';
export type { InputProps } from './Input';

// components/index.ts
export * from './ui';
export * from './auth';
export * from './chat';
```

## 🔧 Configuration Files

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@services/*": ["./src/services/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"],
      "@context/*": ["./src/context/*"],
      "@styles/*": ["./src/styles/*"],
      "@assets/*": ["./src/assets/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@services': resolve(__dirname, './src/services'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils'),
      '@context': resolve(__dirname, './src/context'),
      '@styles': resolve(__dirname, './src/styles'),
      '@assets': resolve(__dirname, './src/assets'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', 'clsx'],
        },
      },
    },
  },
});
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
};
```

## 📋 File Templates

### Component Template

```typescript
// ComponentName.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { ComponentNameProps } from '@types/common';

/**
 * Component description - what it does and when to use it
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  // props
}) => {
  // State
  const [state, setState] = useState(initialState);
  
  // Hooks
  const { user } = useAuth();
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Handlers
  const handleClick = useCallback(() => {
    // Handle click
  }, []);
  
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Hook Template

```typescript
// useHookName.ts
import { useState, useEffect, useCallback } from 'react';
import { HookNameOptions, HookNameReturn } from '@types/common';

export const useHookName = (options: HookNameOptions = {}): HookNameReturn => {
  const [state, setState] = useState(initialState);
  
  const action = useCallback(() => {
    // Action logic
  }, []);
  
  useEffect(() => {
    // Effect logic
  }, []);
  
  return {
    state,
    action,
  };
};
```

### Service Template

```typescript
// serviceNameAPI.ts
import { apiClient } from './apiClient';
import { ServiceRequest, ServiceResponse } from '@types/api';

export const serviceNameAPI = {
  getAll: async (): Promise<ServiceResponse[]> => {
    const response = await apiClient.get('/endpoint');
    return response.data;
  },
  
  getById: async (id: string): Promise<ServiceResponse> => {
    const response = await apiClient.get(`/endpoint/${id}`);
    return response.data;
  },
  
  create: async (data: ServiceRequest): Promise<ServiceResponse> => {
    const response = await apiClient.post('/endpoint', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<ServiceRequest>): Promise<ServiceResponse> => {
    const response = await apiClient.put(`/endpoint/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/endpoint/${id}`);
  },
};
```

---

## 🎯 Best Practices

### 1. File Organization
- **Group related files** together by feature
- **Use index files** for clean imports
- **Keep components small** and focused
- **Separate concerns** (UI, logic, data)

### 2. Naming Conventions
- **Be descriptive** and consistent
- **Use standard patterns** (PascalCase for components, camelCase for utilities)
- **Avoid abbreviations** unless widely understood
- **Include file extensions** in imports

### 3. Import Management
- **Organize imports** by category
- **Use path aliases** for clean imports
- **Remove unused imports**
- **Avoid deep relative imports**

### 4. Code Structure
- **Export at the bottom** of files
- **Use TypeScript** for all files
- **Add JSDoc comments** for complex functions
- **Keep files focused** on single responsibility

---

**Related Documentation**:
- [Frontend Architecture](../architecture/frontend-architecture.md) - High-level architecture
- [Frontend Development](../implementation/frontend-development.md) - Development patterns
- [Development Workflow](./development-workflow.md) - Development processes
- [Troubleshooting](./troubleshooting.md) - Common issues and solutions