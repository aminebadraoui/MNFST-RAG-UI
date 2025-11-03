# Theme System

Complete guide to the RAG Chat theme system, including dark/light mode toggle, custom styling, and theme configuration.

## 🎨 Overview

The RAG Chat application includes a comprehensive theme system that supports both light and dark modes with smooth transitions and persistent user preferences.

## 🌓 Theme Architecture

### Theme Structure

```typescript
interface ThemeState {
  theme: 'light' | 'dark';
}

interface ThemeContextType extends ThemeState {
  setTheme: (theme: 'light' | 'dark') => void;
}
```

### Theme Implementation

The theme system is implemented using:

1. **React Context** - Global theme state management
2. **Tailwind CSS** - Utility-first styling with dark mode variants
3. **Local Storage** - Persistent theme preference
4. **CSS Classes** - Dynamic class application to document root

## 🎯 Theme Toggle Component

### ThemeToggle Component

The [`ThemeToggle`](../../src/components/ui/ThemeToggle.tsx:1) component provides an intuitive theme switching interface:

```typescript
const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useSettings();
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 z-50 p-3 bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-full shadow-lg border border-light-border-primary dark:border-dark-border-primary hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      title="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {theme === 'light' ? (
          <MoonIcon className="h-6 w-6 text-light-text-primary dark:text-dark-text-primary transition-all duration-300" />
        ) : (
          <SunIcon className="h-6 w-6 text-light-text-primary dark:text-dark-text-primary transition-all duration-300" />
        )}
      </div>
      <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-light-bg-primary dark:bg-dark-bg-primary text-light-text-primary dark:text-dark-text-primary text-sm px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      </span>
    </button>
  );
};
```

### Features

- **Fixed Positioning**: Bottom-right corner with high z-index
- **Visual Feedback**: Icon changes based on current theme
- **Hover Effects**: Scale animation and tooltip display
- **Smooth Transitions**: 300ms transition duration
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🎨 Theme Colors

### Light Theme Colors

```css
:root {
  --light-bg-primary: #ffffff;
  --light-bg-secondary: #f3f4f6;
  --light-bg-tertiary: #e5e7eb;
  --light-text-primary: #111827;
  --light-text-secondary: #4b5563;
  --light-text-tertiary: #6b7280;
  --light-border-primary: #d1d5db;
  --light-border-secondary: #e5e7eb;
  --light-accent: #3b82f6;
  --light-accent-hover: #2563eb;
}
```

### Dark Theme Colors

```css
:root {
  --dark-bg-primary: #111827;
  --dark-bg-secondary: #1f2937;
  --dark-bg-tertiary: #374151;
  --dark-text-primary: #f9fafb;
  --dark-text-secondary: #d1d5db;
  --dark-text-tertiary: #9ca3af;
  --dark-border-primary: #374151;
  --dark-border-secondary: #4b5563;
  --dark-accent: #3b82f6;
  --dark-accent-hover: #60a5fa;
}
```

## 🔧 Settings Context Integration

### Theme State Management

The theme system integrates with the [`SettingsContext`](../../src/context/SettingsContext.tsx:1):

```typescript
interface SettingsState {
  apiBaseUrl: string;
  appName: string;
  appVersion: string;
  theme: 'light' | 'dark';
}

const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};
```

### Theme Application

```typescript
// Apply theme to document
useEffect(() => {
  if (state.theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [state.theme]);
```

### Persistent Storage

```typescript
const setTheme = (theme: 'light' | 'dark') => {
  dispatch({ type: 'SET_THEME', payload: theme });
  // Save to localStorage immediately when theme changes
  localStorage.setItem('appSettings', JSON.stringify({ ...state, theme }));
};
```

## 🎯 Tailwind CSS Configuration

### Dark Mode Setup

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#ffffff',
          secondary: '#f3f4f6',
          tertiary: '#e5e7eb',
          text: {
            primary: '#111827',
            secondary: '#4b5563',
            tertiary: '#6b7280',
          },
          border: {
            primary: '#d1d5db',
            secondary: '#e5e7eb',
          },
          accent: '#3b82f6',
        },
        dark: {
          primary: '#111827',
          secondary: '#1f2937',
          tertiary: '#374151',
          text: {
            primary: '#f9fafb',
            secondary: '#d1d5db',
            tertiary: '#9ca3af',
          },
          border: {
            primary: '#374151',
            secondary: '#4b5563',
          },
          accent: '#3b82f6',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### Usage in Components

```typescript
// Example component with theme support
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-light-bg-primary dark:bg-dark-bg-primary border border-light-border-primary dark:border-dark-border-primary rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  );
};
```

## 🚀 Advanced Features

### System Theme Detection

```typescript
const useSystemTheme = () => {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return systemTheme;
};
```

### Theme Transitions

```css
/* Smooth theme transitions */
* {
  transition: background-color 0.3s ease, 
              border-color 0.3s ease, 
              color 0.3s ease;
}

/* Prevent transitions during initial load */
.no-transitions * {
  transition: none !important;
}
```

### Theme-Aware Components

```typescript
// Theme-aware button component
const ThemedButton = ({ variant = 'primary', children, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-all duration-200';
  
  const variantClasses = {
    primary: 'bg-light-accent dark:bg-dark-accent text-white hover:bg-light-accent-hover dark:hover:bg-dark-accent-hover',
    secondary: 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary border border-light-border-primary dark:border-dark-border-primary',
    ghost: 'text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary',
  };
  
  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};
```

## 📱 Responsive Theme Considerations

### Mobile Theme Toggle

```typescript
const MobileThemeToggle = () => {
  const { theme, setTheme } = useSettings();
  
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="md:hidden p-2 rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary"
    >
      {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
    </button>
  );
};
```

### Theme Breakpoints

```css
/* Theme-specific responsive adjustments */
@media (max-width: 768px) {
  .dark .mobile-menu {
    background-color: var(--dark-bg-secondary);
  }
  
  .light .mobile-menu {
    background-color: var(--light-bg-secondary);
  }
}
```

## 🔧 Customization

### Adding Custom Themes

```typescript
// Extended theme system
type ExtendedTheme = 'light' | 'dark' | 'auto' | 'high-contrast';

interface ExtendedThemeState {
  theme: ExtendedTheme;
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
```

### Theme Presets

```typescript
const themePresets = {
  light: {
    primary: '#ffffff',
    secondary: '#f3f4f6',
    accent: '#3b82f6',
  },
  dark: {
    primary: '#111827',
    secondary: '#1f2937',
    accent: '#3b82f6',
  },
  highContrast: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#ffff00',
  },
};
```

## 🧪 Testing Theme System

### Theme Testing Utilities

```typescript
// Test utility for theme switching
const testThemeToggle = () => {
  const themes: ('light' | 'dark')[] = ['light', 'dark'];
  
  themes.forEach(theme => {
    act(() => {
      setTheme(theme);
    });
    
    expect(document.documentElement.classList.contains('dark')).toBe(theme === 'dark');
    expect(document.documentElement.classList.contains('light')).toBe(false);
  });
};
```

### Visual Regression Testing

```typescript
// Theme snapshot testing
describe('Theme System', () => {
  it('should render correctly in light mode', () => {
    render(<Component />, { theme: 'light' });
    expect(container).toMatchSnapshot('light');
  });
  
  it('should render correctly in dark mode', () => {
    render(<Component />, { theme: 'dark' });
    expect(container).toMatchSnapshot('dark');
  });
});
```

## 🚀 Performance Considerations

### Theme Switching Optimization

```typescript
// Optimized theme switching
const optimizedThemeToggle = (newTheme: 'light' | 'dark') => {
  // Use requestAnimationFrame for smooth transitions
  requestAnimationFrame(() => {
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  });
};
```

### CSS Custom Properties Performance

```css
/* Use CSS custom properties for better performance */
.theme-transition {
  transition: background-color var(--theme-transition-duration) ease,
              border-color var(--theme-transition-duration) ease,
              color var(--theme-transition-duration) ease;
}
```

## 🔍 Debugging Theme Issues

### Common Issues

1. **Theme Not Persisting**: Check localStorage implementation
2. **Flickering on Load**: Add theme class to HTML before React loads
3. **Tailwind Classes Not Working**: Verify dark mode configuration
4. **Transition Issues**: Check CSS transition properties

### Debug Tools

```typescript
// Theme debugging utility
const debugTheme = () => {
  console.log('Current theme:', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  console.log('Stored theme:', localStorage.getItem('appSettings'));
  console.log('CSS Variables:', getComputedStyle(document.documentElement).getPropertyValue('--light-bg-primary'));
};
```

---

**Related Documentation**:
- [Frontend Architecture](../architecture/frontend-architecture.md) - Component architecture
- [Settings Context](../../src/context/SettingsContext.tsx) - Settings implementation
- [Tailwind Configuration](../../tailwind.config.js) - Styling configuration
- [UI Components](../components/ui/) - Reusable component library
- [Debug Login System](./debug-login-system.md) - Development authentication