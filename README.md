# RAG Chat Admin Dashboard

A modern, responsive admin dashboard for managing a RAG (Retrieval-Augmented Generation) system with chatbot functionality, document management, and social media integration.

## Project Overview

This dashboard provides a comprehensive interface for:
- Managing chatbot sessions with conversation history
- Uploading and managing documents for RAG processing
- Adding and managing social media links
- Configuring API endpoints and authentication settings

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **State Management**: React Context + useReducer
- **HTTP Client**: Axios with interceptors
- **Authentication**: JWT with refresh token support
- **Build Tool**: Vite
- **Routing**: React Router

## Features

### Authentication System
- JWT-based authentication with refresh token support
- Secure token storage and automatic refresh
- Protected routes and authentication guards
- Login/logout functionality

### Chat Interface
- Session management (create new, select previous)
- Real-time chat interface with message history
- User and bot message differentiation
- Session persistence and management

### Document Management
- Drag-and-drop file upload
- Support for common formats (PDF, TXT, DOCX, etc.)
- Upload progress and status feedback
- Document list management with deletion

### Social Media Integration
- Form to add/remove social media URLs
- Basic URL validation and platform detection
- Link management interface
- Visual platform indicators

### Settings and Configuration
- Configurable API endpoints
- Authentication status display
- Connection status indicators
- Settings persistence

## Project Structure

```
rag-chat-ui/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   ├── auth/             # Authentication components
│   │   ├── chat/             # Chat components
│   │   ├── documents/        # Document components
│   │   ├── social/           # Social media components
│   │   └── settings/         # Settings components
│   ├── pages/                # Page components
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API services
│   ├── context/              # React contexts
│   ├── types/                # TypeScript definitions
│   ├── utils/                # Utility functions
│   └── styles/               # Global styles
├── docs/                     # Documentation
└── configuration files       # Tailwind, TypeScript, etc.
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rag-chat-ui
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=RAG Chat Dashboard
VITE_APP_VERSION=1.0.0
```

## API Integration

The dashboard is designed to work with a backend API that provides the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

### Chat Sessions
- `GET /sessions` - Get user sessions
- `POST /sessions` - Create new session
- `GET /sessions/:id/messages` - Get session messages
- `POST /sessions/:id/messages` - Send message

### Documents
- `POST /documents/upload` - Upload document
- `GET /documents` - Get document list
- `DELETE /documents/:id` - Delete document

### Social Media
- `GET /social-links` - Get social media links
- `POST /social-links` - Add social media link
- `DELETE /social-links/:id` - Delete social media link

For detailed API specifications, see [API Specification](./api-specification.md).

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety
- Conventional Commits for commit messages

### Testing

- `npm run test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests

## Design System

The dashboard uses a custom design system built with Tailwind CSS:

### Color Palette
- Primary: Blue (#3B82F6)
- Secondary: Gray (#6B7280)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Error: Red (#EF4444)

### Typography
- Font Family: Inter, system-ui, sans-serif
- Font Sizes: 12px to 30px
- Font Weights: 400, 500, 600, 700

### Spacing
- Base unit: 4px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## Accessibility

The dashboard is built with accessibility in mind:
- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance (WCAG 2.1 AA)

## Performance

Performance optimizations include:
- Code splitting with React.lazy
- Component memoization
- Image optimization
- API request debouncing
- Bundle size optimization

## Security

Security measures implemented:
- Secure token storage
- XSS prevention
- CSRF protection
- Input validation and sanitization
- HTTPS enforcement

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## Documentation

- [Architecture Plan](./architecture-plan.md) - Detailed system architecture
- [Dashboard Layout](./dashboard-layout.md) - Visual layout and component hierarchy
- [API Specification](./api-specification.md) - Complete API documentation
- [Implementation Guide](./implementation-guide.md) - Code examples and best practices
- [Project Structure](./project-structure.md) - File organization and naming conventions
- [Development Roadmap](./development-roadmap.md) - Timeline and milestones

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the FAQ section

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes and version history.