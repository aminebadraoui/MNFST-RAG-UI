# RAG Chat Admin Dashboard - Architecture Plan

## Project Overview
A modern admin dashboard for managing a RAG (Retrieval-Augmented Generation) system with chatbot functionality, document management, and social media integration.

## Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios
- **Authentication**: JWT with refresh token support
- **Build Tool**: Vite
- **Routing**: React Router

## Project Structure
```
rag-chat-ui/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   │   ├── layout/         # Layout components (header, sidebar)
│   │   ├── chat/           # Chat-related components
│   │   ├── documents/      # Document management components
│   │   └── social/         # Social media components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── context/            # React contexts
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles and Tailwind config
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Core Features

### 1. Authentication System
- JWT-based authentication with refresh token support
- Login/logout functionality
- Token storage and automatic refresh
- Protected routes

### 2. Chatbot Interface
- Session management (create new, select previous)
- Message display with user/bot differentiation
- Real-time chat interface
- Session persistence

### 3. Document Management
- Drag-and-drop file upload
- Support for common formats (PDF, TXT, DOCX, etc.)
- Upload progress and status feedback
- File list management

### 4. Social Media Integration
- Form to add/remove social media URLs
- Basic URL validation
- Platform detection
- Link management interface

### 5. API Configuration
- Configurable API endpoints
- Authentication settings
- Connection status indicators

## Component Architecture

### Layout Components
- **AppLayout**: Main layout wrapper
- **Sidebar**: Navigation menu
- **Header**: Top bar with user info and actions
- **MainContent**: Content area wrapper

### Chat Components
- **ChatSessionList**: List of chat sessions
- **ChatSession**: Individual chat session item
- **ChatWindow**: Main chat interface
- **Message**: Individual message component
- **MessageInput**: Chat input component

### Document Components
- **DocumentUploader**: Drag-and-drop upload area
- **DocumentList**: List of uploaded documents
- **DocumentItem**: Individual document item
- **UploadProgress**: Upload progress indicator

### Social Media Components
- **SocialMediaForm**: Form to add social media links
- **SocialMediaList**: List of added links
- **SocialMediaItem**: Individual social media link item

## Data Flow

### Authentication Flow
1. User logs in with credentials
2. API returns JWT access token and refresh token
3. Tokens stored in secure storage
4. Access token included in API requests
5. Refresh token used to get new access token when needed

### Chat Flow
1. User selects or creates a session
2. Session messages loaded from API
3. User sends message
4. Message sent to API with session ID
5. Response added to message list

### Document Upload Flow
1. User drags/selects files
2. Files validated and uploaded to API
3. Progress shown during upload
4. Success/error feedback displayed

## API Integration

### Authentication Endpoints
- POST /auth/login - User login
- POST /auth/refresh - Refresh access token
- POST /auth/logout - User logout

### Chat Endpoints
- GET /sessions - Get user sessions
- POST /sessions - Create new session
- GET /sessions/:id/messages - Get session messages
- POST /sessions/:id/messages - Send message

### Document Endpoints
- POST /documents/upload - Upload document
- GET /documents - Get document list
- DELETE /documents/:id - Delete document

### Social Media Endpoints
- GET /social-links - Get social media links
- POST /social-links - Add social media link
- DELETE /social-links/:id - Delete social media link

## Design System

### Color Palette
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)
- Background: White (#FFFFFF)
- Surface: Gray (#F9FAFB)

### Typography
- Font Family: Inter, system-ui, sans-serif
- Font Sizes: 12px, 14px, 16px, 18px, 20px, 24px, 30px
- Font Weights: 400, 500, 600, 700

### Spacing
- Base unit: 4px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Border Radius
- Small: 4px
- Medium: 8px
- Large: 12px

## Responsive Design
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Accessibility Features
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

## Performance Considerations
- Code splitting with React.lazy
- Image optimization
- API request debouncing
- Component memoization where appropriate
- Bundle size optimization

## Security Considerations
- Secure token storage
- XSS prevention
- CSRF protection
- Input validation and sanitization
- HTTPS enforcement