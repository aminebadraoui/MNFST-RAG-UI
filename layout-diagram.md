# Application Layout Diagrams

## New Application Flow

```mermaid
graph TD
    A[User Login] --> B[Chat Page - Default]
    B --> C[Chat Page with Sessions Panel]
    B --> D[Documents Page]
    B --> E[Social Page]
    B --> F[Settings Page]
    
    C --> G[Chat Sessions List]
    C --> H[Chat Messages Area]
    C --> I[Message Input]
    
    D --> J[Document Upload]
    D --> K[Document List]
    D --> L[Total Documents Stat]
    
    E --> M[Connected Accounts]
    E --> N[Add/Delete Account]
```

## New Layout Structure

```mermaid
graph LR
    subgraph "Application Layout"
        A[Sidebar] --> B[Main Content]
        
        subgraph "Sidebar Navigation"
            A1[Chat]
            A2[Documents]
            A3[Social]
            A4[Settings]
        end
        
        subgraph "Chat Page Layout"
            B1[Sessions Panel] --> B2[Chat Area]
            B1 --> B3[New Session Button]
            B2 --> B4[Messages]
            B2 --> B5[Input Field]
        end
    end
```

## Component Hierarchy Changes

```mermaid
graph TD
    A[App] --> B[AppLayout]
    B --> C[Sidebar]
    B --> D[MainContent]
    D --> E[Page Content]
    
    subgraph "Removed Components"
        F[Header]
        G[Dashboard]
        H[Chat Sessions in Sidebar]
    end
    
    subgraph "New Components"
        I[ChatPage with Sessions Panel]
        J[Simplified DocumentsPage]
        K[Simplified SocialPage]
    end
```

## Page Navigation Flow

```mermaid
stateDiagram-v2
    [*] --> Chat: Login Success
    Chat --> Documents: Navigate
    Chat --> Social: Navigate
    Chat --> Settings: Navigate
    
    Documents --> Chat: Navigate
    Social --> Chat: Navigate
    Settings --> Chat: Navigate
    
    Chat --> [*]: Logout
    Documents --> [*]: Logout
    Social --> [*]: Logout
    Settings --> [*]: Logout