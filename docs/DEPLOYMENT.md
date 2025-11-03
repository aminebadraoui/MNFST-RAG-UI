# Deployment Guide

Complete guide to deploying the RAG Chat Admin Dashboard to production, with focus on Hostinger hosting and Supabase integration.

## 🎯 Deployment Overview

The simplified multi-tenant RAG Chat system is designed for easy deployment on shared hosting platforms like Hostinger with Supabase as the backend service.

### Deployment Architecture

```mermaid
graph TB
    subgraph "Hostinger Hosting"
        A[Static Files (React Build)]
        B[Environment Variables]
        C[Domain Configuration]
        D[SSL Certificate]
    end
    
    subgraph "Supabase (External)"
        E[PostgreSQL Database]
        F[Authentication Service]
        G[File Storage]
        H[Row Level Security]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
```

### Infrastructure Requirements

- **Node.js Application Server**
- **Supabase Database Connection**
- **File Storage via Supabase Storage**
- **Basic SSL Certificate**
- **Simple Reverse Proxy (optional)**

## 🚀 Quick Deployment

### Prerequisites

1. **Hostinger Account** with hosting plan supporting Node.js
2. **Supabase Project** with PostgreSQL database
3. **Custom Domain** (optional but recommended)
4. **SSL Certificate** (usually provided by Hostinger)

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
DATABASE_URL=postgresql://[supabase-connection]
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-key]

# Authentication
JWT_ACCESS_SECRET=[jwt-access-secret]
JWT_REFRESH_SECRET=[jwt-refresh-secret]

# Application
NODE_ENV=production
PORT=3000
BASE_URL=https://yourdomain.com

# File Storage
STORAGE_URL=https://[project].supabase.co/storage/v1
STORAGE_BUCKET=rag-chat-files

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
VITE_USE_MOCK_API=false
```

#### 3. Deploy to Hostinger

**Method 1: Hostinger Control Panel**
1. Log in to Hostinger control panel
2. Navigate to "Hosting" → "Advanced" → "Website Manager"
3. Upload build files to public_html directory
4. Set up Node.js application
5. Configure environment variables
6. Set up custom domain and SSL

**Method 2: FTP/SFTP Upload**
```bash
# Upload build files
sftp user@yourdomain.com
put -r dist/* public_html/
exit
```

**Method 3: Git Deployment (if supported)**
```bash
# Add Hostinger remote
git remote add hostinger git@hostinger.com:username/repository.git

# Push to production
git push hostinger main
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

## 🗄️ Supabase Setup

### Create Supabase Project

1. **Sign up** at [supabase.com](https://supabase.com)
2. **Create new project** with desired region
3. **Note project details**:
   - Project URL
   - Anon key
   - Service role key

### Database Schema Setup

#### Run Database Migrations

```sql
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

### Storage Configuration

#### Create Storage Buckets

```sql
-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    false,
    52428800, -- 50MB
    ARRAY['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    2097152, -- 2MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);
```

#### Storage Policies

```sql
-- Policies for document storage
CREATE POLICY "Users can upload documents for their tenant" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents' AND 
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = current_setting('app.current_tenant_id')::text
    );

CREATE POLICY "Users can view documents from their tenant" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = current_setting('app.current_tenant_id')::text
    );
```

### Authentication Configuration

#### Set Up Auth Providers

1. **Email/Password** (enabled by default)
2. **Social Providers** (optional):
   - Google
   - GitHub
   - Microsoft

#### Configure JWT Settings

```javascript
// In Supabase Dashboard → Settings → Auth
{
  "jwt_secret": "your-jwt-secret",
  "jwt_expiry": "3600s",
  "refresh_token_rotation_enabled": true,
  "security_update_password_require_reauthentication": true
}
```

## 🔧 Production Configuration

### Environment Variables

Create `.env.production` file:

```env
# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-key]

# Authentication
JWT_ACCESS_SECRET=[strong-random-string]
JWT_REFRESH_SECRET=[another-strong-random-string]

# Application
NODE_ENV=production
PORT=3000
BASE_URL=https://yourdomain.com

# Storage
STORAGE_URL=https://[project].supabase.co/storage/v1
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

#### Node.js Server Setup

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
    script: 'server.js',
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

### Hostinger Resources

- [Hostinger Documentation](https://support.hostinger.com/)
- [Node.js Hosting Guide](https://support.hostinger.com/en/articles/4978795-how-to-install-and-run-node-js-app-on-hostinger)
- [SSL Configuration](https://support.hostinger.com/en/articles/4978795-how-to-install-ssl-certificate)

### Supabase Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Database Guide](https://supabase.com/docs/guides/database)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [Auth Guide](https://supabase.com/docs/guides/auth)

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