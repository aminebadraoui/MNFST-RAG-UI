# Quick Start Guide

Get the RAG Chat Admin Dashboard running in minutes with this comprehensive quick start guide.

## 🚀 Prerequisites

| Software | Minimum Version | Recommended Version | Installation |
|----------|------------------|-------------------|-------------|
| **Node.js** | v16.0.0 | v18.0.0 LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | v8.0.0 | v9.0.0 | Included with Node.js |
| **Git** | v2.20.0 | v2.40.0 | [git-scm.com](https://git-scm.com/) |

### Optional Tools
- **VS Code** - Recommended IDE with extensions
- **Docker** - For containerized development
- **Postman** - For API testing

## ⚡ 10-Minute Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd rag-chat-ui

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit environment variables (optional for development)
# The defaults work for development with mock API
```

### 3. Start Development Server

```bash
# Start the application
npm run dev
```

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 🔑 Default Login Credentials

The application starts with mock API enabled. Use these credentials to explore:

### Superadmin Access
- **Email**: `superadmin@ragchat.com`
- **Password**: `admin123`
- **Access**: Tenant management, system settings

### Tenant Admin Access
- **Email**: `admin@tenant.com`
- **Password**: `admin123`
- **Access**: User management, documents, social media

### User Access
- **Email**: `user@tenant.com`
- **Password**: `user123`
- **Access**: Chat interface only

## 🎯 First Steps

### Explore the Interface

1. **Login** with any of the default credentials
2. **Chat Interface** (default landing page) - Try sending messages
3. **Document Management** (Admin+) - Upload test documents
4. **Social Media** (Admin+) - Add social media links
5. **Settings** - Configure API endpoints and preferences

### Test Key Features

#### Chat Functionality
1. Click "New Session" to create a chat session
2. Type a message like "What is RAG?"
3. Observe the streaming response
4. Try different conversation scenarios

#### Document Upload (Admin+)
1. Navigate to "Documents" section
2. Click "Upload Documents"
3. Select a PDF, DOCX, or TXT file
4. Watch the progress tracking
5. Check the processed document status

#### Social Media Integration (Admin+)
1. Go to "Social Media" section
2. Add a link like `https://twitter.com/example`
3. See automatic platform detection
4. Test removing links

## 🔧 Configuration Options

### Mock API vs Real API

The application defaults to mock API for development:

```env
# Use Mock API (default for development)
VITE_USE_MOCK_API=true

# Use Real API (for production)
VITE_USE_MOCK_API=false
```

### API Configuration

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3001/api/v1

# Application Settings
VITE_APP_NAME=RAG Chat Dashboard
VITE_APP_VERSION=1.0.0
```

### Development Features

```env
# Mock API Settings
VITE_MOCK_DELAY_MIN=500
VITE_MOCK_DELAY_MAX=2000
VITE_MOCK_ERROR_RATE=0.1

# Mock Account Credentials (for development)
VITE_MOCK_SUPERADMIN_EMAIL=superadmin@ragchat.com
VITE_MOCK_SUPERADMIN_PASSWORD=admin123
VITE_MOCK_TENANT_ADMIN_EMAIL=admin@tenant.com
VITE_MOCK_TENANT_ADMIN_PASSWORD=admin123
VITE_MOCK_USER_EMAIL=user@tenant.com
VITE_MOCK_USER_PASSWORD=user123
```

## 🏗️ Project Structure Overview

```
rag-chat-ui/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI elements
│   │   ├── layout/         # Layout components
│   │   ├── auth/           # Authentication components
│   │   └── ...             # Feature components
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── context/            # React contexts
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── docs/                   # Documentation
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🎨 Understanding the UI

### Navigation Structure

- **Chat** (Default) - Main chat interface
- **Documents** - Document management (Admin+)
- **Social Media** - Social media links (Admin+)
- **Tenants** - Tenant management (Superadmin only)
- **Users** - User management (Admin+)
- **Settings** - Application configuration

### Role-Based Access

| Feature | Superadmin | Tenant Admin | User |
|---------|------------|--------------|------|
| Chat Interface | ✅ | ✅ | ✅ |
| Document Management | ✅ | ✅ | ❌ |
| Social Media | ✅ | ✅ | ❌ |
| User Management | ✅ | ✅ | ❌ |
| Tenant Management | ✅ | ❌ | ❌ |
| Settings | ✅ | ✅ | ✅ |

## 🔍 Development Tools

### Browser DevTools

1. **React DevTools** - Install Chrome extension
2. **Network Tab** - Monitor API requests
3. **Console** - View application logs
4. **Elements** - Inspect DOM and styles

### VS Code Extensions

Recommended extensions for best development experience:

```bash
# Install extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

### Useful Commands

```bash
# Development
npm run dev              # Start development server
npm run dev -- --port 3000  # Start on specific port

# Code Quality
npm run lint             # Check code quality
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript type checking
npm run format          # Format code with Prettier

# Testing
npm run test             # Run tests
npm run test:watch       # Watch mode testing
npm run test:coverage   # Test coverage report

# Building
npm run build           # Production build
npm run preview         # Preview production build
```

## 🚨 Common Issues & Solutions

### Port Already in Use

```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9

# Or start on different port
npm run dev -- --port 3000
```

### Dependency Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Working

Ensure your `.env` file is in project root:

```env
# No quotes around values
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_USE_MOCK_API=true
```

### Hot Reload Not Working

1. Check for TypeScript errors in terminal
2. Restart development server (`Ctrl+C` and `npm run dev`)
3. Ensure file watchers are working

## 🎯 Next Steps

### For Development

1. **Read Architecture Guide** - Understand system design
2. **Study Component Patterns** - Learn React patterns used
3. **Explore API Integration** - Understand data flow
4. **Review Development Workflow** - Learn best practices

### For Production

1. **Configure Real Backend** - Set up your API
2. **Environment Variables** - Configure production settings
3. **Build Application** - Create production build
4. **Deploy** - Follow deployment guide

### For Customization

1. **Styling** - Customize Tailwind configuration
2. **Components** - Modify or create new components
3. **API Integration** - Connect to your backend
4. **Features** - Add new functionality

## 📚 Additional Resources

### Documentation
- [Development Setup](./development-setup.md) - Complete environment setup
- [Configuration](./configuration.md) - Detailed configuration options
- [System Architecture](../architecture/system-architecture.md) - High-level architecture
- [API Reference](../api/overview.md) - Complete API documentation
- [Theme System](../features/theme-system.md) - Theme and UI customization
- [Debug Login System](../features/debug-login-system.md) - Development authentication

### External Resources
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🆘 Getting Help

### Troubleshooting
- Check [Troubleshooting Guide](../reference/troubleshooting.md) for common issues
- Review [FAQ](../reference/faq.md) for frequently asked questions

### Community Support
- GitHub Issues - Report bugs and request features
- Discord Community - Get help from community
- Documentation - Search existing documentation

---

**Quick Start Complete!** 🎉

You now have a running RAG Chat Admin Dashboard. Explore the features, experiment with different user roles, and start building your customizations.

**Next Steps**: Choose your path:
- **Developer**: Read [Development Setup](./development-setup.md) for complete environment
- **Implementer**: Study [System Architecture](../architecture/system-architecture.md) for deployment
- **Customizer**: Explore [Frontend Architecture](../architecture/frontend-architecture.md) for modifications