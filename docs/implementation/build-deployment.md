# Deployment Guide

Complete guide to deploying the RAG Chat Admin Dashboard to production, compatible with various hosting providers and PostgreSQL databases.

## 🎯 Deployment Overview

The simplified multi-tenant RAG Chat system is designed for flexible deployment on various hosting platforms with PostgreSQL as the database backend.

### Deployment Architecture

```mermaid
graph TB
    subgraph "Hosting Provider"
        A[Static Files (React Build)]
        B[Environment Variables]
        C[Domain Configuration]
        D[SSL Certificate]
    end
    
    subgraph "Backend Service"
        E[API Server (FastAPI/Node.js/etc.)]
        F[Authentication Service]
        G[File Storage Service]
    end
    
    subgraph "Database"
        H[PostgreSQL Database]
        I[Row Level Security]
    end
    
    A --> E
    B --> F
    C --> G
    E --> H
    F --> I
```

### Infrastructure Requirements

- **Web Server** (Nginx, Apache, or hosting provider's server)
- **Backend API Server** (FastAPI, Node.js, etc.)
- **PostgreSQL Database** (with pgvector extension)
- **File Storage** (local or cloud-based)
- **SSL Certificate**
- **Reverse Proxy** (optional but recommended)

## 🚀 Quick Deployment

### Prerequisites

1. **Hosting Account** with a provider of your choice
2. **PostgreSQL Database** (with pgvector extension)
3. **Custom Domain** (optional but recommended)
4. **SSL Certificate** (usually provided by hosting provider)

### Step-by-Step Deployment

#### 1. Prepare Application for Production

```bash
# 1. Install production dependencies
npm ci --production

# 2. Build application
npm run build

# 3. Verify build output
ls -la dist/
```

#### 2. Configure Environment Variables

Create production environment file:

```env
# Database Configuration
DATABASE_URL=postgresql://[your-postgres-connection]

# Authentication
JWT_ACCESS_SECRET=[jwt-access-secret]
JWT_REFRESH_SECRET=[jwt-refresh-secret]

# Application
NODE_ENV=production
PORT=3000
BASE_URL=https://yourdomain.com

# File Storage
STORAGE_URL=[your-storage-service-url]
STORAGE_BUCKET=rag-chat-files

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
VITE_USE_MOCK_API=false
```

#### 3. Deploy to Your Hosting Provider

**Method 1: Control Panel Upload**
1. Log in to your hosting control panel
2. Navigate to file manager or website manager
3. Upload build files to the appropriate directory
4. Configure environment variables
5. Set up custom domain and SSL

**Method 2: FTP/SFTP Upload**
```bash
# Upload build files
sftp user@yourdomain.com
put -r dist/* public_html/
exit
```

**Method 3: Git Deployment (if supported)**
```bash
# Add hosting provider remote
git remote add production git@your-provider.com:username/repository.git

# Push to production
git push production main
```

#### 4. Configure Domain and SSL

1. **Domain Setup**:
   - Point your domain to Hostinger nameservers
   - Wait for DNS propagation (24-48 hours)

2. **SSL Certificate**:
   - Enable free SSL through Hostinger control panel
   - Verify SSL is active for your domain

#### 5. Test Deployment

```bash
# Test application
curl -I https://yourdomain.com

# Check API endpoints
curl https://yourdomain.com/api/v1/auth/me
```

## 🗄️ Database Setup

### PostgreSQL Database Setup

1. **Create PostgreSQL Database** with your hosting provider or self-hosted
2. **Enable pgvector extension** for vector operations
3. **Note connection details**:
   - Host
   - Port
   - Database name
   - Username
   - Password

### Database Schema Setup

#### Run Database Migrations

```sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create tenants table
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('superadmin', 'tenant_admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

-- Create other tables (chat_sessions, messages, documents, social_links)
-- See DATABASE.md for complete schema
```

#### Enable Row Level Security

```sql
-- Enable RLS on tenant-specific tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY tenant_isolation_users ON users
    FOR ALL TO authenticated
    USING (
        tenant_id = current_setting('app.current_tenant_id')::uuid
        OR current_setting('app.user_role') = 'superadmin'
    );
```

### File Storage Configuration

#### Option 1: Local Storage
```bash
# Create storage directories
mkdir -p /var/www/storage/documents
mkdir -p /var/www/storage/avatars
chmod 755 /var/www/storage
```

#### Option 2: Cloud Storage (AWS S3, Google Cloud Storage, etc.)
1. Create storage buckets
2. Configure access keys
3. Set up CORS policies
4. Update environment variables with storage configuration

### Authentication Configuration

#### JWT Settings

Configure JWT settings in your backend application:

```python
# FastAPI example
SECRET_KEY = "your-jwt-secret"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7
```

## 🔧 Production Configuration

### Environment Variables

Create `.env.production` file:

```env
# Database
DATABASE_URL=postgresql://[username]:[password]@[host]:[port]/[database]

# Authentication
JWT_ACCESS_SECRET=[strong-random-string]
JWT_REFRESH_SECRET=[another-strong-random-string]

# Application
NODE_ENV=production
PORT=3000
BASE_URL=https://yourdomain.com

# Storage
STORAGE_URL=[your-storage-service-url]
STORAGE_BUCKET=rag-chat-files

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
ENABLE_LOGGING=true
LOG_LEVEL=info
```

### Server Configuration

#### FastAPI Server Setup (Recommended)

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[process.env.CORS_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
app.mount("/static", StaticFiles(directory="dist"), name="static")

# API routes
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### Node.js/Express Server Setup

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use(limiter);

// Serve static files
app.use(express.static('dist'));

// API routes
app.use('/api', apiRoutes);

// Catch all handler
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### Process Manager (PM2)

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'rag-chat-app',
    script: 'main.py', // or server.js for Node.js
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## 🔒 Security Configuration

### SSL Certificate Setup

#### Hostinger SSL (Recommended)

1. **Enable Free SSL**:
   - Log in to Hostinger control panel
   - Navigate to "SSL" → "Let's Encrypt SSL"
   - Select your domain and install

2. **Verify SSL**:
   ```bash
   curl -I https://yourdomain.com
   ```

#### Custom SSL Certificate

If you have a custom SSL certificate:

1. **Upload Certificate Files**:
   - Private key (.key)
   - Certificate (.crt)
   - Certificate chain (.ca-bundle)

2. **Configure in Hostinger**:
   - Navigate to "SSL" → "Custom SSL"
   - Upload certificate files
   - Enable SSL for domain

### Security Headers

Configure security headers in your server:

```javascript
// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.supabase.co"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Environment Security

1. **Secure Environment Variables**:
   - Use strong, random secrets
   - Never commit `.env` files
   - Use different keys for development/production

2. **Database Security**:
   - Use Supabase Row Level Security
   - Limit database user permissions
   - Enable database backups

## 📊 Monitoring & Logging

### Application Monitoring

#### Basic Logging

```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'rag-chat-app' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

#### Error Tracking

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong'
      }
    });
  } else {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: err.message,
        stack: err.stack
      }
    });
  }
});
```

### Performance Monitoring

#### Basic Metrics

```javascript
// Performance monitoring
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
});
```

#### Health Check Endpoint

```javascript
// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test
      
    - name: Build application
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.API_URL }}
        
    - name: Deploy to Hostinger
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        source: "dist/*"
        target: "/home/${{ secrets.USERNAME }}/public_html/"
        strip_components: 1
```

### Deployment Script

Create `deploy.sh`:

```bash
#!/bin/bash

echo "Deploying RAG Chat Application..."

# 1. Install dependencies
npm ci --production

# 2. Run tests
npm test

# 3. Build application
npm run build

# 4. Deploy to Hostinger
rsync -avz --delete dist/ user@yourdomain.com:public_html/

# 5. Restart application
ssh user@yourdomain.com "pm2 restart rag-chat-app"

echo "Deployment complete!"
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Application Not Loading

**Symptoms**: Blank page or 404 errors
**Solutions**:
- Check if build files are uploaded correctly
- Verify `.htaccess` configuration
- Check browser console for JavaScript errors
- Ensure all environment variables are set

#### 2. Database Connection Errors

**Symptoms**: API returns 500 errors
**Solutions**:
- Verify Supabase connection string
- Check if database is online
- Ensure RLS policies are correctly set
- Test database connection manually

#### 3. Authentication Issues

**Symptoms**: Login failures or token errors
**Solutions**:
- Check JWT secrets are correctly set
- Verify Supabase auth configuration
- Ensure CORS is properly configured
- Check token expiration settings

#### 4. File Upload Issues

**Symptoms**: Upload failures or storage errors
**Solutions**:
- Verify Supabase storage configuration
- Check file size limits
- Ensure storage policies are correct
- Test storage permissions

### Debugging Tools

#### 1. Application Logs

```bash
# Check PM2 logs
pm2 logs rag-chat-app

# Check application logs
tail -f logs/combined.log
tail -f logs/error.log
```

#### 2. Database Debugging

```sql
-- Check database connections
SELECT * FROM pg_stat_activity;

-- Check RLS policies
SELECT * FROM pg_policies;

-- Test tenant isolation
SELECT current_setting('app.current_tenant_id');
```

#### 3. Network Debugging

```bash
# Test API endpoints
curl -v https://yourdomain.com/api/v1/health

# Check SSL certificate
openssl s_client -connect yourdomain.com:443

# Test database connection
psql $DATABASE_URL -c "SELECT 1;"
```

## 📈 Performance Optimization

### Frontend Optimization

#### 1. Build Optimization

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react']
        }
      }
    },
    minify: 'terser',
    sourcemap: false
  }
});
```

#### 2. Asset Optimization

```javascript
// Compress static assets
const compression = require('compression');

app.use(compression({
  level: 6,
  threshold: 1024
}));
```

### Backend Optimization

#### 1. Database Optimization

```sql
-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_tenant_user ON chat_sessions(tenant_id, user_id);
CREATE INDEX idx_messages_session_created ON messages(session_id, created_at);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
```

#### 2. Caching Strategy

```javascript
// Simple in-memory cache
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 300 }); // 5 minutes

// Cache middleware
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached) {
      return res.json(cached);
    }
    
    res.sendResponse = res.json;
    res.json = (body) => {
      cache.set(key, body, duration);
      res.sendResponse(body);
    };
    
    next();
  };
};
```

## 📋 Deployment Checklist

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database schema updated
- [ ] SSL certificate configured
- [ ] Domain DNS configured
- [ ] Backup strategy in place
- [ ] Monitoring tools set up
- [ ] Error logging configured
- [ ] Performance testing completed
- [ ] Security review completed

### Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] All API endpoints working
- [ ] Database connectivity verified
- [ ] Authentication flow tested
- [ ] File uploads working
- [ ] SSL certificate valid
- [ ] Monitoring alerts configured
- [ ] Backup process verified
- [ ] Performance metrics collected
- [ ] Error tracking active

## 🔗 Additional Resources

### Hosting Provider Resources

#### General Hosting
- [DigitalOcean Documentation](https://docs.digitalocean.com/)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Vultr Documentation](https://www.vultr.com/docs/)

#### Backend Frameworks
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Django Documentation](https://docs.djangoproject.com/)

### Database Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector Extension](https://github.com/pgvector/pgvector)
- [Database Connection Pooling](https://www.postgresql.org/docs/current/pgpool.html)

### Monitoring Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Winston Logging](https://github.com/winstonjs/winston)
- [Node.js Performance](https://nodejs.org/en/docs/guides/simple-profiling)

---

**Related Documentation**:
- [Architecture Guide](./ARCHITECTURE.md) - System architecture and design
- [API Reference](./API.md) - Complete API documentation
- [Database Schema](./DATABASE.md) - Database structure and types
- [Development Guide](./DEVELOPMENT.md) - Development setup and patterns