# Dashboard Layout and Component Hierarchy

## Overall Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        Header                                │
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│   Sidebar   │              Main Content Area                 │
│             │                                               │
│             │                                               │
│             │                                               │
│             │                                               │
│             │                                               │
│             │                                               │
│             │                                               │
│             │                                               │
│             │                                               │
└─────────────┴───────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── Router
├── AuthProvider
└── AppLayout
    ├── Header
    │   ├── Logo
    │   ├── UserMenu
    │   └── SettingsButton
    ├── Sidebar
    │   ├── Navigation
    │   │   ├── ChatNavItem
    │   │   ├── DocumentsNavItem
    │   │   ├── SocialNavItem
    │   │   └── SettingsNavItem
    │   └── SessionList (when on chat page)
    │       ├── SessionItem
    │       └── NewSessionButton
    └── MainContent
        ├── ChatPage
        │   ├── ChatWindow
        │   │   ├── MessageList
        │   │   │   └── Message
        │   │   └── MessageInput
        │   └── SessionManager
        │       ├── SessionSelector
        │       └── NewSessionButton
        ├── DocumentsPage
        │   ├── DocumentUploader
        │   │   ├── DropZone
        │   │   └── FileInput
        │   └── DocumentList
        │       └── DocumentItem
        ├── SocialPage
        │   ├── SocialMediaForm
        │   │   ├── URLInput
        │   │   └── AddButton
        │   └── SocialMediaList
        │       └── SocialMediaItem
        └── SettingsPage
            ├── APIConfig
            │   ├── EndpointInput
            │   └── SaveButton
            └── AuthConfig
                ├── TokenDisplay
                └── RefreshButton
```

## Page Layouts

### Chat Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│                        Header                                │
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│   Session   │              Chat Window                      │
│    List     │                                               │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │                                         │ │
│             │  │            Message List                 │ │
│             │  │                                         │ │
│             │  │                                         │ │
│             │  └─────────────────────────────────────────┘ │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │            Message Input               │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                               │
└─────────────┴───────────────────────────────────────────────┘
```

### Documents Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│                        Header                                │
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│   Sidebar   │            Document Upload Area               │
│             │                                               │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │                                         │ │
│             │  │          Drag & Drop Zone               │ │
│             │  │                                         │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                               │
│             │            Document List                     │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │          Document Item 1                │ │
│             │  ├─────────────────────────────────────────┤ │
│             │  │          Document Item 2                │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                               │
└─────────────┴───────────────────────────────────────────────┘
```

### Social Media Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│                        Header                                │
├─────────────┬───────────────────────────────────────────────┤
│             │                                               │
│   Sidebar   │            Add Social Media Link              │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │  URL Input: [__________________] [Add]  │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                               │
│             │            Social Media Links                │
│             │  ┌─────────────────────────────────────────┐ │
│             │  │          Link Item 1        [Remove]    │ │
│             │  ├─────────────────────────────────────────┤ │
│             │  │          Link Item 2        [Remove]    │ │
│             │  └─────────────────────────────────────────┘ │
│             │                                               │
└─────────────┴───────────────────────────────────────────────┘
```

## State Management Flow

```
AuthProvider
├── AuthContext
│   ├── user
│   ├── accessToken
│   ├── refreshToken
│   ├── isAuthenticated
│   └── login/logout/refresh functions
└── API Client
    ├── Request interceptor (adds auth token)
    └── Response interceptor (handles token refresh)

ChatProvider
├── ChatContext
│   ├── sessions
│   ├── currentSession
│   ├── messages
│   └── session management functions

DocumentProvider
├── DocumentContext
│   ├── documents
│   ├── uploadProgress
│   └── document management functions

SocialProvider
├── SocialContext
│   ├── socialLinks
│   └── social link management functions
```

## Navigation Flow

```
Login Page
└── On Success → Dashboard
    ├── Chat Page (Default)
    │   ├── Session List (Sidebar)
    │   ├── Chat Window (Main)
    │   └── New Session Creation
    ├── Documents Page
    │   ├── Upload Area
    │   └── Document List
    ├── Social Media Page
    │   ├── Add Link Form
    │   └── Links List
    └── Settings Page
        ├── API Configuration
        └── Authentication Status
```

## Responsive Design Breakpoints

### Desktop (> 1024px)
- Full sidebar visible
- Three-column layout on some pages
- Maximum content width utilization

### Tablet (768px - 1024px)
- Collapsible sidebar
- Two-column layouts
- Adjusted spacing and font sizes

### Mobile (< 768px)
- Hidden sidebar (hamburger menu)
- Single-column layout
- Touch-optimized components
- Simplified navigation