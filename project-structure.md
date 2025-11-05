# Project Structure for MNFST-RAG Admin Dashboard

## Complete File Structure

```
mnfst-rag/
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

## Component Dependencies

### Authentication Flow
```
App.tsx
├── AuthProvider
│   ├── AuthContext
│   └── ProtectedRoute
│       └── LoginPage
│           └── LoginForm
```

### Main Application Flow
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

## Data Flow Architecture

### Context Providers Structure
```
App
├── AuthProvider
│   ├── AuthContext
│   └── API Client (with auth interceptors)
├── SettingsProvider
│   └── SettingsContext
├── Router
│   └── Protected Routes
│       ├── ChatProvider
│       │   └── ChatContext
│       ├── DocumentProvider
│       │   └── DocumentContext
│       └── SocialProvider
│           └── SocialContext
```

### API Service Layer
```
API Client
├── Auth Interceptors
│   ├── Request: Add auth token
│   └── Response: Handle token refresh
├── API Services
│   ├── authAPI
│   ├── chatAPI
│   ├── documentAPI
│   └── socialAPI
└── Error Handling
    ├── Network errors
    ├── Authentication errors
    └── Validation errors
```

## State Management Strategy

### Global State (Context)
- Authentication state (user, tokens)
- Application settings (API endpoints)
- Theme preferences

### Feature-specific State (Context)
- Chat sessions and messages
- Document uploads and status
- Social media links

### Local Component State
- Form inputs
- UI states (dropdowns, modals)
- Temporary data

## File Naming Conventions

### Components
- PascalCase for component files: `Button.tsx`, `ChatWindow.tsx`
- Index files for exports: `index.ts`
- Group related components in folders

### Hooks
- CamelCase with 'use' prefix: `useAuth.ts`, `useChat.ts`
- Custom hooks in dedicated hooks folder

### Services
- CamelCase with 'API' suffix: `authAPI.ts`, `chatAPI.ts`
- Group related API methods in service files

### Types
- CamelCase for type files: `auth.ts`, `chat.ts`
- Export interfaces and types from index files

### Utils
- CamelCase for utility files: `helpers.ts`, `validators.ts`
- Group related utility functions

## Import Organization

### Import Order
1. React and related libraries
2. Third-party libraries
3. Internal components (relative imports)
4. Services and hooks
5. Types and interfaces
6. Utility functions

### Example
```typescript
import React, { useState, useEffect } from 'react';
import { useRouter } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../services/authAPI';
import { User } from '../../types/auth';
import { formatDate } from '../../utils/formatters';
```

## Code Organization Principles

### Separation of Concerns
- UI components separate from business logic
- API calls abstracted in service layer
- State management isolated in contexts
- Utility functions reusable across components

### Reusability
- Generic UI components in `components/ui`
- Feature-specific components in feature folders
- Custom hooks for reusable logic
- Utility functions for common operations

### Scalability
- Modular structure for easy feature addition
- Clear boundaries between features
- Consistent naming and organization
- Type safety throughout the application

This project structure provides a solid foundation for building a scalable and maintainable React application with TypeScript. The organization follows best practices and makes it easy for developers to navigate and understand the codebase.