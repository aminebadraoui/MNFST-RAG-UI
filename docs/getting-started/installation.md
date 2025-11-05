# Installation Guide

Step-by-step instructions for installing and setting up the MNFST-RAG Admin Dashboard development environment.

## 🚀 Quick Start

### Prerequisites

| Software | Minimum Version | Recommended Version | Installation |
|----------|------------------|-------------------|-------------|
| **Node.js** | v16.0.0 | v18.0.0 LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | v8.0.0 | v9.0.0 | Included with Node.js |
| **Git** | v2.20.0 | v2.40.0 | [git-scm.com](https://git-scm.com/) |

### System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 2GB free disk space
- **Network**: Internet connection for npm package installation

## 📦 Installation Steps

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/mnfst-rag.git

# Navigate to project directory
cd mnfst-rag

# Checkout the correct branch (if needed)
git checkout main
```

### 2. Install Dependencies

#### Using npm (Recommended)
```bash
# Install all dependencies
npm install

# Install with specific registry (if needed)
npm install --registry https://registry.npmjs.org/
```

#### Using yarn
```bash
# Install dependencies with yarn
yarn install

# Install with specific registry
yarn install --registry https://registry.yarnpkg.com/
```

#### Using pnpm
```bash
# Install dependencies with pnpm
pnpm install

# Install with strict peer dependencies
pnpm install --strict-peer-deps
```

### 3. Environment Setup

#### Create Environment File
```bash
# Copy the environment template
cp .env.example .env

# Edit the environment file
nano .env  # or use your preferred editor
```

#### Configure Environment Variables
```env
# Application Configuration
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_APP_NAME=MNFST-RAG Dashboard
VITE_APP_VERSION=1.0.0

# Mock API Configuration (for development)
VITE_USE_MOCK_API=true
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

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_DEBUG_LOGIN=true
```

### 4. Verify Installation

#### Check Node.js Version
```bash
# Verify Node.js version
node --version
# Should show v18.0.0 or higher

# Verify npm version
npm --version
# Should show v9.0.0 or higher
```

#### Check Dependencies
```bash
# List installed packages
npm list

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities (if any)
npm audit fix
```

#### Test Build Process
```bash
# Test development build
npm run dev

# Test production build
npm run build

# Preview production build
npm run preview
```

## 🔧 Advanced Installation

### Custom Node.js Installation

#### Using NVM (Node Version Manager)
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

# Verify installation
node --version
npm --version
```

#### Using FNM (Fast Node Manager)
```bash
# Install FNM
curl -fsSL https://fnm.vercel.app/install | bash

# Reload shell
source ~/.bashrc

# Install Node.js LTS
fnm install --lts
fnm use lts-latest

# Set as default
fnm default lts-latest
```

### Custom npm Configuration

#### Configure npm Registry
```bash
# Set npm registry (if needed)
npm config set registry https://registry.npmjs.org/

# Configure npm cache
npm config set cache ~/.npm-cache

# Set default author
npm config set init-author-name "Your Name"
npm config set init-author-email "your.email@example.com"
```

#### Configure npm Mirrors
```bash
# Use npm mirror for faster downloads (China)
npm config set registry https://registry.npmmirror.com

# Use taobao mirror (alternative)
npm config set registry https://registry.npm.taobao.org
```

## 🐳 Docker Installation

### Using Dockerfile

```bash
# Build Docker image
docker build -t mnfst-rag .

# Run container
docker run -p 5173:5173 mnfst-rag

# Run with volume mount for development
docker run -p 5173:5173 -v $(pwd):/app mnfst-rag npm run dev
```

### Using Docker Compose

```bash
# Start with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop containers
docker-compose down

# View logs
docker-compose logs -f app
```

### Docker Compose Configuration
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
```

## 🔍 Troubleshooting

### Common Installation Issues

#### Permission Errors
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use nvm to avoid system-wide installation
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

#### Network Issues
```bash
# Configure npm proxy (if behind corporate firewall)
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Use alternative registry
npm config set registry https://registry.npmjs.org/
```

#### Dependency Conflicts
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### Node.js Version Issues
```bash
# Check current Node.js version
node --version

# Upgrade to latest LTS
nvm install --lts
nvm use --lts

# Or download directly from nodejs.org
```

### Platform-Specific Issues

#### Windows
```bash
# Enable long paths (if needed)
npm config set msvs_version 2019

# Use Windows Subsystem for Linux (WSL)
wsl --install

# Or use Git Bash for Windows
# Run commands in Git Bash terminal
```

#### macOS
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js via Homebrew
brew install node
```

#### Linux
```bash
# Update package manager
sudo apt update  # Ubuntu/Debian
sudo yum update  # CentOS/RHEL

# Install build essentials
sudo apt install build-essential  # Ubuntu/Debian
sudo yum groupinstall "Development Tools"  # CentOS/RHEL

# Install Node.js via package manager
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs  # Ubuntu/Debian
```

## ✅ Verification Steps

### 1. Start Development Server
```bash
# Start the development server
npm run dev

# Or with specific port
npm run dev -- --port 3000
```

### 2. Access Application
Open your browser and navigate to:
- **Default**: `http://localhost:5173`
- **Custom Port**: `http://localhost:3000` (if specified)

### 3. Test Functionality
Verify these features work:
- [ ] Application loads without errors
- [ ] Login page displays correctly
- [ ] Mock authentication works
- [ ] Navigation between sections
- [ ] Document upload functionality
- [ ] Chat interface
- [ ] Settings page

### 4. Check Developer Tools
Open browser developer tools and verify:
- [ ] No JavaScript errors in console
- [ ] Network requests complete successfully
- [ ] CSS loads correctly
- [ ] Application responsive design

## 🚀 Next Steps

After successful installation:

1. **Read Development Guide**: [Development Setup](./development-setup.md)
2. **Review Architecture**: [System Architecture](../architecture/system-architecture.md)
3. **Explore API**: [API Overview](../api/overview.md)
4. **Configure Backend**: [Backend Contract](../api/backend-contract.md)

## 📚 Additional Resources

### Node.js Documentation
- [Official Node.js Documentation](https://nodejs.org/docs/)
- [npm Documentation](https://docs.npmjs.com/)
- [Vite Documentation](https://vitejs.dev/)

### Development Tools
- [VS Code Documentation](https://code.visualstudio.com/docs)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)

### Community Support
- [Node.js Community](https://nodejs.org/en/community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/node.js)
- [GitHub Discussions](https://github.com/nodejs/node/discussions)

---

**Related Documentation**:
- [Development Setup](./development-setup.md) - Complete development environment setup
- [Configuration Guide](./configuration.md) - Application configuration
- [Architecture Guide](../architecture/system-architecture.md) - System architecture overview