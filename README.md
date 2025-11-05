# MNFST RAG Admin Dashboard - Simplified Multi-Tenant

A simplified multi-tenant MNFST RAG SaaS solution built with React and TypeScript. Perfect for self-hosting.

## 🎯 What This Is

A streamlined multi-tenant MNFST RAG system with three user roles:
- **Superadmin**: Creates and manages tenants
- **Tenant Admin**: Manages documents, social media, and users for their tenant  
- **User**: Accesses chatbot with tenant-specific knowledge base

**Key Features:**
- ✅ Simple 3-role authentication system
- ✅ Tenant data isolation with row-level security
- ✅ Document upload and management
- ✅ Social media integration for knowledge base
- ✅ Real-time chat with streaming responses
- ✅ Self-hosted deployment ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/mnfst-rag.git
cd mnfst-rag

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Setup

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api/v1
VITE_APP_NAME=MNFST RAG Dashboard
```

## 📚 Documentation

### 🚀 Getting Started
- **[Documentation Overview](./docs/README.md)** - Complete documentation hub
- **[Development Guide](./docs/DEVELOPMENT.md)** - Setup, patterns, testing, and tools

### 🏗️ Core Architecture
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System design, multi-tenant architecture, security
- **[Database Schema](./docs/DATABASE.md)** - Database structure, types, and relationships

### 📡 API & Integration
- **[API Reference](./docs/API.md)** - Complete API reference with authentication and endpoints

### 🚀 Deployment
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment guide

## 🏗️ System Architecture

### User Roles & Access

```mermaid
graph TD
    A[Superadmin] --> B[Create Tenants]
    A --> C[Manage All Tenants]
    A --> D[System Administration]
    
    E[Tenant Admin] --> F[Manage Documents]
    E --> G[Manage Social Media]
    E --> H[Manage Tenant Users]
    
    I[User] --> J[Access Chatbot]
    I --> K[Chat with Knowledge Base]
    
    L[Tenant Data] --> M[Row Level Security]
    L --> N[Complete Isolation]
```

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for fast development
- React Router for navigation

**Backend:**
- Node.js with Express
- JWT for session management
- PostgreSQL with pgvector

**Infrastructure:**
- Simple deployment without complex orchestration

## 🎯 Key Features

### 💬 Chat System
- Real-time chat with streaming responses
- Session management and history
- Tenant-specific knowledge base
- Message threading and organization

### 📄 Document Management
- File upload with progress tracking
- Multiple file upload support
- Document processing and indexing
- Tenant-isolated storage

### 🔗 Social Media Integration
- Add social media links for knowledge base
- Support for major platforms (Twitter, Facebook, LinkedIn, etc.)
- Tenant-specific management

### 👥 User Management
- Three-role authentication system
- Role-based access control
- Tenant-specific user management
- Simple JWT-based authentication

### 🏢 Multi-Tenant Support
- Complete data isolation between tenants
- Tenant creation and management
- Row-level security in database
- Self-hosted deployment ready

## 🚀 Deployment

### Self-Hosted Deployment

```bash
# 1. Build application
npm run build

# 2. Deploy to your hosting provider
# Upload build files to your hosting
# Configure environment variables
# Set up domain and SSL
```

### Database Setup

1. **Set Up Database**
   - Run schema from [Database Schema](./docs/DATABASE.md)
   - Enable row level security
   - Create necessary indexes

2. **Configure Authentication**
   - Enable JWT authentication
   - Set up auth providers
   - Configure redirect URLs

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components
│   └── ui/            # Base UI components
├── context/           # React contexts
├── pages/             # Page components
│   ├── ChatPage.tsx    # Default page after login
│   ├── DocumentsPage.tsx
│   ├── SocialPage.tsx
│   ├── TenantsPage.tsx
│   ├── UsersPage.tsx
│   └── SettingsPage.tsx
├── services/          # API services
│   └── mock/          # Mock API for development
├── types/             # TypeScript type definitions
└── styles/            # Global styles
```

## 🔗 Links

- **Documentation**: [docs/README.md](./docs/README.md)
- **API Reference**: [docs/API.md](./docs/API.md)
- **Architecture Guide**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Development Guide**: [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)
- **Database Schema**: [docs/DATABASE.md](./docs/DATABASE.md)
- **Deployment Guide**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- **Main Repository**: [github.com/your-org/mnfst-rag](https://github.com/your-org/mnfst-rag)
- **Issue Tracker**: [github.com/your-org/mnfst-rag/issues](https://github.com/your-org/mnfst-rag/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Version**: 2.0.0 (Simplified)  
**Maintainers**: MNFST RAG Development Team