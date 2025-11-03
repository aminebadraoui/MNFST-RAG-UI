# Configuration Guide

Complete guide to configuring the RAG Chat Admin Dashboard for development and production environments.

## 🎯 Overview

The RAG Chat Dashboard uses environment variables for configuration, supporting both development and production setups with mock and real API modes.

## ⚙️ Environment Variables

### Core Application Settings

```env
# Application Identity
VITE_APP_NAME=RAG Chat Dashboard
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Multi-tenant RAG Chat SaaS solution

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_API_TIMEOUT=10000

# Development Mode
VITE_DEV_MODE=true
VITE_DEBUG_MODE=false
```

### Mock API Configuration

```env
# Enable Mock API (for development/testing)
VITE_USE_MOCK_API=true

# Mock API Behavior
VITE_MOCK_DELAY_MIN=500        # Minimum delay in ms
VITE_MOCK_DELAY_MAX=2000       # Maximum delay in ms
VITE_MOCK_ERROR_RATE=0.1       # Error probability (0.0-1.0)
VITE_MOCK_DATA_SEED=12345       # Seed for consistent data
VITE_MOCK_REALISTIC_DATA=true   # Generate realistic test data
VITE_MOCK_CONSISTENT_DATA=true # Maintain data consistency
```

### Feature Flags

```env
# Analytics and Monitoring
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true

# Development Features
VITE_ENABLE_HOT_RELOAD=true
VITE_ENABLE_SOURCE_MAPS=true
VITE_ENABLE_DEVTOOLS=true
```

### Production Settings

```env
# Production Configuration
VITE_API_BASE_URL=https://your-domain.com/api/v1
VITE_USE_MOCK_API=false

# Security Settings
VITE_ENABLE_HTTPS=true
VITE_SECURE_COOKIES=true
VITE_CORS_ORIGIN=https://your-domain.com
```

## 🔧 Configuration Files

### Environment-Specific Files

Create separate configuration files for different environments:

#### Development (.env.development)
```env
VITE_DEV_MODE=true
VITE_DEBUG_MODE=true
VITE_USE_MOCK_API=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PERFORMANCE_MONITORING=false
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

#### Staging (.env.staging)
```env
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
VITE_USE_MOCK_API=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_API_BASE_URL=https://staging.your-domain.com/api/v1
```

#### Production (.env.production)
```env
VITE_DEV_MODE=false
VITE_DEBUG_MODE=false
VITE_USE_MOCK_API=false
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_API_BASE_URL=https://your-domain.com/api/v1
```

### Local Override (.env.local)
```env
# Local development overrides (not committed to git)
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_DEBUG_MODE=true
VITE_MOCK_DELAY_MIN=100
VITE_MOCK_DELAY_MAX=500
```

## 🌐 API Configuration

### Backend Framework Compatibility

The frontend is designed to work with various backend frameworks:

#### FastAPI (Python)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=30000
```

#### Node.js/Express
```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_API_TIMEOUT=10000
```

#### Django (Python)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT=20000
```

### API Client Configuration

```typescript
// API Client settings (src/services/apiClient.ts)
const apiClientConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  headers: {
    'Content-Type': 'application/json',
  },
  retryAttempts: 3,
  retryDelay: 1000,
};
```

## 🔐 Authentication Configuration

### JWT Settings

```env
# JWT Configuration (for reference - backend handles actual implementation)
VITE_JWT_ACCESS_TOKEN_EXPIRY=900    # 15 minutes
VITE_JWT_REFRESH_TOKEN_EXPIRY=604800 # 7 days
VITE_JWT_ALGORITHM=HS256
```

### Authentication Flow

```typescript
// Authentication configuration (src/services/authAPI.ts)
const authConfig = {
  tokenStorage: 'localStorage', // or 'cookies' for production
  autoRefresh: true,
  refreshThreshold: 0.9, // Refresh when 90% of token life elapsed
  logoutOnRefreshFailure: true,
};
```

## 🎨 UI Configuration

### Theme Settings

```env
# Theme Configuration
VITE_DEFAULT_THEME=light
VITE_ENABLE_THEME_TOGGLE=true
VITE_THEME_STORAGE_KEY=rag-chat-theme
```

### Responsive Design

```env
# Responsive Breakpoints
VITE_MOBILE_BREAKPOINT=768
VITE_TABLET_BREAKPOINT=1024
VITE_DESKTOP_BREAKPOINT=1280
```

### Font Configuration

```env
# Typography
VITE_FONT_FAMILY=Inter, ui-sans-serif, system-ui
VITE_FONT_MONO=JetBrains Mono, ui-monospace, monospace
VITE_ENABLE_FONT_OPTIMIZATION=true
```

## 📊 Performance Configuration

### Build Optimization

```env
# Build Settings
VITE_BUILD_SOURCEMAP=true
VITE_BUILD_MINIFY=true
VITE_BUILD_TARGET=es2020
VITE_ENABLE_CODE_SPLITTING=true
```

### Bundle Analysis

```env
# Bundle Analysis
VITE_ENABLE_BUNDLE_ANALYSIS=false
VITE_BUNDLE_ANALYSIS_PORT=8888
```

### Caching Strategy

```env
# Caching Configuration
VITE_ENABLE_SERVICE_WORKER=true
VITE_CACHE_STRATEGY=networkFirst
VITE_CACHE_MAX_AGE=86400  # 24 hours in seconds
```

## 🔍 Debugging Configuration

### Development Tools

```env
# Debug Settings
VITE_DEBUG_MODE=true
VITE_ENABLE_CONSOLE_LOGGING=true
VITE_ENABLE_PERFORMANCE_LOGGING=true
VITE_ENABLE_API_LOGGING=true
```

### Error Reporting

```env
# Error Configuration
VITE_ENABLE_ERROR_BOUNDARY=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ERROR_REPORTING_ENDPOINT=https://errors.your-domain.com/api/errors
VITE_ERROR_REPORTING_API_KEY=your-api-key
```

## 🚀 Deployment Configuration

### Build Configuration

```env
# Production Build
VITE_BUILD_COMMAND=build
VITE_BUILD_OUTPUT_DIR=dist
VITE_BUILD_ASSET_DIR=assets
```

### Deployment Targets

#### Static Hosting (Vercel, Netlify, etc.)
```env
VITE_DEPLOYMENT_TARGET=static
VITE_BASE_URL=/
VITE_BUILD_ASSET_PREFIX=/
```

#### Server-Side Rendering
```env
VITE_DEPLOYMENT_TARGET=ssr
VITE_BASE_URL=/
VITE_BUILD_ASSET_PREFIX=/assets/
```

#### Docker Deployment
```env
VITE_DEPLOYMENT_TARGET=docker
VITE_DOCKER_PORT=3000
VITE_DOCKER_HOST=0.0.0.0
```

## 🧪 Testing Configuration

### Test Environment

```env
# Testing Settings
VITE_TEST_MODE=true
VITE_USE_MOCK_API=true
VITE_MOCK_DELAY_MIN=0
VITE_MOCK_DELAY_MAX=100
VITE_MOCK_ERROR_RATE=0
```

### Test Data

```env
# Test Data Configuration
VITE_TEST_DATA_SEED=12345
VITE_ENABLE_TEST_DATA_VALIDATION=true
VITE_TEST_TIMEOUT=5000
```

## 📱 Mobile Configuration

### Mobile Optimization

```env
# Mobile Settings
VITE_ENABLE_MOBILE_OPTIMIZATION=true
VITE_MOBILE_TOUCH_THRESHOLD=10
VITE_ENABLE_GESTURE_SUPPORT=true
```

### Progressive Web App

```env
# PWA Configuration
VITE_ENABLE_PWA=true
VITE_PWA_NAME=RAG Chat Dashboard
VITE_PWA_SHORT_NAME=RAG Chat
VITE_PWA_THEME_COLOR=#3b82f6
```

## 🔒 Security Configuration

### Content Security Policy

```env
# CSP Settings
VITE_ENABLE_CSP=true
VITE_CSP_DEFAULT_SRC=self
VITE_CSP_SCRIPT_SRC=self unsafe-inline
VITE_CSP_STYLE_SRC=self unsafe-inline
VITE_CSP_IMG_SRC=self data: https:
VITE_CSP_CONNECT_SRC=self https:
```

### HTTPS Configuration

```env
# HTTPS Settings
VITE_FORCE_HTTPS=true
VITE_SSL_CERT_PATH=/path/to/cert.pem
VITE_SSL_KEY_PATH=/path/to/key.pem
```

## 📈 Analytics Configuration

### Google Analytics

```env
# Google Analytics
VITE_GA_TRACKING_ID=GA-XXXXXXXXX
VITE_GA_ENABLED=true
VITE_GA_DEBUG_MODE=false
```

### Custom Analytics

```env
# Custom Analytics
VITE_CUSTOM_ANALYTICS_ENDPOINT=https://analytics.your-domain.com/api/events
VITE_CUSTOM_ANALYTICS_API_KEY=your-api-key
VITE_ANALYTICS_SAMPLE_RATE=0.1
```

## 🔧 Advanced Configuration

### Custom Hooks

```env
# Build Hooks
VITE_PRE_BUILD_SCRIPT=./scripts/pre-build.js
VITE_POST_BUILD_SCRIPT=./scripts/post-build.js
VITE_PRE_DEPLOY_SCRIPT=./scripts/pre-deploy.js
```

### Environment Detection

```typescript
// Environment detection utility (src/utils/environment.ts)
export const environment = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isTest: import.meta.env.MODE === 'test',
  isMockAPI: import.meta.env.VITE_USE_MOCK_API === 'true',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  appName: import.meta.env.VITE_APP_NAME,
  version: import.meta.env.VITE_APP_VERSION,
};
```

### Configuration Validation

```typescript
// Configuration validation (src/config/validation.ts)
export const validateConfig = () => {
  const required = [
    'VITE_APP_NAME',
    'VITE_API_BASE_URL',
  ];
  
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  // Validate URL format
  try {
    new URL(import.meta.env.VITE_API_BASE_URL);
  } catch (error) {
    throw new Error(`Invalid API_BASE_URL: ${import.meta.env.VITE_API_BASE_URL}`);
  }
};
```

## 🔄 Configuration Management

### Runtime Configuration

```typescript
// Runtime configuration updates (src/config/runtime.ts)
export const updateConfig = (key: string, value: string) => {
  // Update in-memory configuration
  // Persist to localStorage if needed
  // Trigger re-render of affected components
};

export const resetConfig = () => {
  // Reset to default values
  // Clear persisted configuration
  // Reload page or trigger re-initialization
};
```

### Configuration Persistence

```typescript
// Configuration persistence (src/config/persistence.ts)
export const saveConfig = (config: Partial<AppConfig>) => {
  // Save to localStorage
  // Encrypt sensitive data
  // Handle quota limits
};

export const loadConfig = (): AppConfig => {
  // Load from localStorage
  // Decrypt sensitive data
  // Handle migration between versions
};
```

## 📋 Configuration Checklist

### Development Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Configure `VITE_API_BASE_URL`
- [ ] Set `VITE_USE_MOCK_API=true` for frontend development
- [ ] Configure mock API settings if needed
- [ ] Set up development tools and debugging

### Production Setup
- [ ] Set `VITE_USE_MOCK_API=false`
- [ ] Configure production API URL
- [ ] Enable analytics and error reporting
- [ ] Set up security headers and CSP
- [ ] Configure SSL/HTTPS settings

### Testing Setup
- [ ] Configure test environment variables
- [ ] Set up mock API for testing
- [ ] Configure test data generation
- [ ] Set up test timeouts and thresholds

## 🚨 Common Issues

### Environment Variable Issues

#### Variables Not Loading
```bash
# Check if .env file exists
ls -la .env

# Verify variable format (no quotes around values)
cat .env

# Restart development server
npm run dev
```

#### Invalid Configuration
```bash
# Validate configuration
npm run type-check

# Check for TypeScript errors
npm run lint

# Build to verify configuration
npm run build
```

### API Connection Issues

#### CORS Errors
```env
# Configure CORS origin
VITE_CORS_ORIGIN=http://localhost:5173

# Or configure backend to allow all origins (development only)
VITE_CORS_ORIGIN=*
```

#### Authentication Issues
```env
# Check token configuration
VITE_JWT_ACCESS_TOKEN_EXPIRY=900
VITE_JWT_REFRESH_TOKEN_EXPIRY=604800

# Verify API URL matches backend
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

## 📚 Additional Resources

### Environment Variable Documentation
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Node.js Environment Variables](https://nodejs.org/api/process.html#processenv)
- [Docker Environment Variables](https://docs.docker.com/engine/reference/commandline/)

### Configuration Best Practices
- [12-Factor App Configuration](https://12factor.net/)
- [Environment Variable Security](https://snyk.io/blog/10-best-practices-for-handling-environment-variables/)
- [Configuration Management Patterns](https://martinfowler.com/articles/configuration-patterns/)

---

**Related Documentation**:
- [Installation Guide](./installation.md) - Installation instructions
- [Development Setup](./development-setup.md) - Development environment setup
- [API Overview](../api/overview.md) - API configuration
- [Architecture Guide](../architecture/system-architecture.md) - System configuration