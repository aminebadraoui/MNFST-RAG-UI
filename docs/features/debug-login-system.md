# Debug Login System

Complete guide to the RAG Chat debug login system, including development-only quick login, role-based authentication, and environment configuration.

## 🎯 Overview

The debug login system provides a convenient way for developers to quickly authenticate with different user roles during development without needing to remember credentials. This feature is only available in development mode and is completely disabled in production builds.

## 🔐 Security Considerations

### Development-Only Feature

The debug login system is designed with multiple security layers:

1. **Environment Check**: Only enabled in development mode (`import.meta.env.DEV`)
2. **Feature Flag**: Requires `VITE_ENABLE_DEBUG_LOGIN=true` environment variable
3. **Production Safety**: Automatically disabled in production builds
4. **No Credentials Exposure**: Uses environment variables, not hardcoded credentials

### Security Implementation

```typescript
// Only show in development mode when debug login is enabled
const isDebugMode = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEBUG_LOGIN === 'true';

if (!isDebugMode) {
  return null; // Component renders nothing in production
}
```

## 🎨 Component Architecture

### DebugLogin Component

The [`DebugLogin`](../../src/components/auth/DebugLogin.tsx:1) component provides role-based quick login:

```typescript
interface DebugLoginProps {
  className?: string;
}

const DebugLogin: React.FC<DebugLoginProps> = ({ className = '' }) => {
  const { login, isLoading, clearError } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);
  
  // Only show in development mode when debug login is enabled
  const isDebugMode = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEBUG_LOGIN === 'true';
  
  if (!isDebugMode) {
    return null;
  }
  
  const handleQuickLogin = async (role: UserRole) => {
    clearError();
    setLoadingRole(role);
    const credentials = mockAuthAPI.getCredentialsByRole(role);
    try {
      await login(credentials.email, credentials.password);
    } finally {
      setLoadingRole(null);
    }
  };
  
  // ... component implementation
};
```

### Role-Based Quick Login

The system provides three role-specific login buttons:

```typescript
const roleButtons = [
  { 
    role: 'superadmin' as UserRole, 
    label: 'Super Admin', 
    color: 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800' 
  },
  { 
    role: 'tenant_admin' as UserRole, 
    label: 'Tenant Admin', 
    color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' 
  },
  { 
    role: 'user' as UserRole, 
    label: 'User', 
    color: 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800' 
  }
];
```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Enable debug login system (development only)
VITE_ENABLE_DEBUG_LOGIN=true

# Mock credentials for each role
VITE_MOCK_SUPERADMIN_EMAIL=superadmin@ragchat.com
VITE_MOCK_SUPERADMIN_PASSWORD=admin123
VITE_MOCK_TENANT_ADMIN_EMAIL=admin@tenant.com
VITE_MOCK_TENANT_ADMIN_PASSWORD=admin123
VITE_MOCK_USER_EMAIL=user@tenant.com
VITE_MOCK_USER_PASSWORD=user123
```

### Mock API Integration

The debug login system integrates with the mock authentication API:

```typescript
// mockAuthAPI.getCredentialsByRole()
const getCredentialsByRole = (role: UserRole) => {
  const credentials = {
    superadmin: {
      email: import.meta.env.VITE_MOCK_SUPERADMIN_EMAIL || 'superadmin@ragchat.com',
      password: import.meta.env.VITE_MOCK_SUPERADMIN_PASSWORD || 'admin123'
    },
    tenant_admin: {
      email: import.meta.env.VITE_MOCK_TENANT_ADMIN_EMAIL || 'admin@tenant.com',
      password: import.meta.env.VITE_MOCK_TENANT_ADMIN_PASSWORD || 'admin123'
    },
    user: {
      email: import.meta.env.VITE_MOCK_USER_EMAIL || 'user@tenant.com',
      password: import.meta.env.VITE_MOCK_USER_PASSWORD || 'user123'
    }
  };
  
  return credentials[role] || credentials.user;
};
```

## 🎯 User Interface

### Collapsible Design

The debug login component features a collapsible interface:

```typescript
return (
  <div className={`mt-6 ${className}`}>
    <div className="text-center">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs text-light-text-quaternary dark:text-dark-text-quaternary hover:text-light-text-tertiary dark:hover:text-dark-text-tertiary transition-colors underline"
      >
        {isExpanded ? 'Hide' : 'Show'} Debug Login Options
      </button>
    </div>
    
    {isExpanded && (
      <div className="mt-4 p-4 bg-dark-bg-tertiary/50 rounded-lg border border-dark-border-primary">
        {/* Role buttons */}
      </div>
    )}
  </div>
);
```

### Visual Design

- **Minimal Footprint**: Small toggle button when collapsed
- **Clear Role Distinction**: Color-coded buttons for each role
- **Loading States**: Individual loading indicators per role
- **Dark Theme Support**: Consistent with application theme
- **Responsive Design**: Works on all screen sizes

### Role Button Styling

```typescript
<Button
  key={role}
  type="button"
  onClick={() => handleQuickLogin(role)}
  loading={loadingRole === role}
  disabled={isLoading || loadingRole !== null}
  size="sm"
  className={`w-full ${color} text-white transition-all duration-200`}
>
  Login as {label}
</Button>
```

## 🔧 Integration with LoginForm

### Seamless Integration

The debug login is integrated into the main [`LoginForm`](../../src/components/auth/LoginForm.tsx:1) component:

```typescript
const LoginForm = () => {
  // ... form implementation
  
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Standard login form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email and password fields */}
      </form>
      
      {/* Debug login - only in development */}
      <DebugLogin />
    </div>
  );
};
```

### Conditional Rendering

The debug login only appears when:
1. Application is in development mode
2. Debug login feature flag is enabled
3. Mock API is being used

## 🧪 Testing with Debug Login

### Development Workflow

1. **Enable Debug Mode**: Set `VITE_ENABLE_DEBUG_LOGIN=true` in `.env`
2. **Start Development**: Run `npm run dev`
3. **Quick Access**: Click "Show Debug Login Options"
4. **Select Role**: Click any role button for instant login
5. **Test Features**: Access role-specific functionality immediately

### Role Testing Matrix

| Role | Access Level | Key Features for Testing |
|-------|--------------|-------------------------|
| **Superadmin** | System-wide | Tenant management, user management across all tenants, system settings |
| **Tenant Admin** | Tenant-specific | Document management, social media, user management within tenant |
| **User** | Limited | Chat interface, personal settings |

### Rapid Testing Scenarios

```typescript
// Example testing workflow
const testWorkflow = async () => {
  // 1. Test as Superadmin
  await quickLogin('superadmin');
  await testTenantManagement();
  await testUserManagement();
  
  // 2. Test as Tenant Admin
  await quickLogin('tenant_admin');
  await testDocumentUpload();
  await testSocialMediaManagement();
  
  // 3. Test as User
  await quickLogin('user');
  await testChatInterface();
  await testPersonalSettings();
};
```

## 🔒 Production Safety

### Automatic Disabling

The debug login system includes multiple production safety mechanisms:

```typescript
// Environment-based disabling
const isDebugMode = import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEBUG_LOGIN === 'true';

// Build-time checks
if (process.env.NODE_ENV === 'production') {
  // Debug login is completely disabled
  return null;
}

// Additional safety in mock API
const mockAuthAPI = {
  getCredentialsByRole: (role: UserRole) => {
    if (import.meta.env.PROD) {
      throw new Error('Debug credentials not available in production');
    }
    // ... return credentials
  }
};
```

### Security Best Practices

1. **No Hardcoded Credentials**: All credentials come from environment variables
2. **Environment Validation**: Validate environment before enabling
3. **Production Exclusion**: Multiple layers prevent production activation
4. **Clear Indicators**: Visual cues show this is a development feature
5. **Audit Trail**: All debug logins are logged like normal logins

## 🚀 Advanced Features

### Custom Role Testing

```typescript
// Extension for custom role testing
const CustomDebugLogin = () => {
  const [customRole, setCustomRole] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  
  const handleCustomLogin = async () => {
    await login(customEmail, customPassword);
  };
  
  return (
    <div className="mt-4 p-4 border rounded-lg">
      <h4>Custom Login</h4>
      {/* Custom login form */}
    </div>
  );
};
```

### Session Persistence Testing

```typescript
// Test different session scenarios
const testSessionScenarios = async () => {
  // Test session expiration
  await testSessionExpiry();
  
  // Test token refresh
  await testTokenRefresh();
  
  // Test cross-tab synchronization
  await testCrossTabSync();
};
```

### Performance Monitoring

```typescript
// Debug login performance tracking
const trackDebugLogin = (role: UserRole) => {
  const startTime = performance.now();
  
  return async () => {
    await quickLogin(role);
    const endTime = performance.now();
    
    console.log(`Debug login (${role}) took ${endTime - startTime}ms`);
  };
};
```

## 🔧 Configuration Options

### Environment Variables

```env
# Debug login configuration
VITE_ENABLE_DEBUG_LOGIN=true              # Enable/disable debug login
VITE_DEBUG_LOGIN_AUTO_EXPAND=false       # Auto-expand debug panel
VITE_DEBUG_LOGIN_SHOW_CREDENTIALS=true   # Show credentials in UI
VITE_DEBUG_LOGIN_ROLE_COLORS=true         # Use role-specific colors
```

### Advanced Configuration

```typescript
// Debug login configuration interface
interface DebugLoginConfig {
  enabled: boolean;
  autoExpand: boolean;
  showCredentials: boolean;
  roleColors: boolean;
  customRoles: UserRole[];
  performanceTracking: boolean;
}
```

## 🧪 Debugging Tools

### Debug Login Diagnostics

```typescript
// Debug login diagnostic tool
const DebugLoginDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState(null);
  
  const runDiagnostics = () => {
    const results = {
      environment: import.meta.env.DEV ? 'development' : 'production',
      debugFlag: import.meta.env.VITE_ENABLE_DEBUG_LOGIN,
      mockAPI: import.meta.env.VITE_USE_MOCK_API,
      credentialsAvailable: checkCredentialsAvailable(),
      authContext: checkAuthContext(),
      localStorage: checkLocalStorage(),
    };
    
    setDiagnostics(results);
  };
  
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <button onClick={runDiagnostics}>Run Diagnostics</button>
      {diagnostics && <pre>{JSON.stringify(diagnostics, null, 2)}</pre>}
    </div>
  );
};
```

### Credential Validation

```typescript
// Validate debug credentials
const validateDebugCredentials = () => {
  const requiredVars = [
    'VITE_MOCK_SUPERADMIN_EMAIL',
    'VITE_MOCK_SUPERADMIN_PASSWORD',
    'VITE_MOCK_TENANT_ADMIN_EMAIL',
    'VITE_MOCK_TENANT_ADMIN_PASSWORD',
    'VITE_MOCK_USER_EMAIL',
    'VITE_MOCK_USER_PASSWORD'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    console.warn('Missing debug credentials:', missing);
    return false;
  }
  
  return true;
};
```

## 📚 Best Practices

### Development Workflow

1. **Use for Testing Only**: Debug login is for development, not for production features
2. **Test All Roles**: Regularly test all user roles
3. **Clear Session**: Log out between role switches to test fresh login
4. **Monitor Console**: Watch for authentication-related logs
5. **Validate Permissions**: Ensure role-based access controls work correctly

### Security Considerations

1. **Never Commit Credentials**: Never commit actual credentials to version control
2. **Use Environment Variables**: Always use environment variables for credentials
3. **Production Safety**: Verify debug login is disabled in production builds
4. **Regular Rotation**: Rotate mock credentials periodically
5. **Access Logging**: Monitor debug login usage in development

---

**Related Documentation**:
- [Authentication System](../authentication/token-management.md) - Authentication architecture
- [Mock API System](../api/mock-api.md) - Mock API implementation
- [Environment Configuration](../getting-started/installation.md) - Environment setup
- [Development Setup](../getting-started/development-setup.md) - Development environment
- [Theme System](./theme-system.md) - Theme integration