# RAG Chat UI Simplification Plan

## Overview
This document outlines the plan to simplify the RAG Chat UI application according to the new requirements:
- Make Chat the default screen after login
- Remove chat sessions from sidebar and integrate them into the chat container
- Simplify Documents page by removing unnecessary status indicators
- Simplify Social Media page by removing scheduled posts and statistics
- Remove the header component entirely

## Current Architecture

### Current Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                    Header                                 │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│   Sidebar   │            Main Content                   │
│             │                                           │
│ - Dashboard │                                           │
│ - Chat      │  ┌─────────────┬─────────────────────────┐ │
│ - Documents │  │ Chat        │                         │ │
│ - Social    │  │ Sessions    │      Chat Area          │ │
│ - Settings  │  │             │                         │ │
│             │  └─────────────┴─────────────────────────┘ │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

## New Simplified Architecture

### New Layout Structure
```
┌─────────────┬───────────────────────────────────────────┐
│             │                                           │
│   Sidebar   │            Main Content                   │
│             │                                           │
│ - Chat      │  ┌─────────────┬─────────────────────────┐ │
│ - Documents │  │ Chat        │                         │ │
│ - Social    │  │ Sessions    │      Chat Area          │ │
│ - Settings  │  │             │                         │ │
│             │  └─────────────┴─────────────────────────┘ │
│             │                                           │
└─────────────┴───────────────────────────────────────────┘
```

## Implementation Details

### 1. App.tsx Changes
- Remove Dashboard route completely
- Redirect root path "/" to "/chat" instead of Dashboard
- Remove DashboardPage import

### 2. AppLayout.tsx Changes
- Remove Header component import and usage
- Adjust layout to work without header
- Remove mobile sidebar overlay logic that references header

### 3. Sidebar.tsx Changes
- Remove Dashboard from navigation array
- Remove chat sessions section completely
- Simplify navigation to only show: Chat, Documents, Social, Settings
- Remove session-related props and logic

### 4. ChatPage.tsx Redesign
- Restructure to have two-panel layout:
  - Left panel: Chat sessions (independent scrolling)
  - Right panel: Chat messages and input
- Sessions panel should take approximately 30% of width
- Chat area should take approximately 70% of width
- Both panels should have independent scrolling
- Add "New Session" button in sessions panel

### 5. DocumentsPage.tsx Simplification
- Remove status indicators from document list
- Remove "Indexed Documents" and "Total Chunks" statistics cards
- Keep only "Total Documents" statistic
- Simplify document table by removing status column

### 6. SocialPage.tsx Simplification
- Remove scheduled posts section completely
- Remove statistics cards for:
  - Total Followers
  - Scheduled Posts
  - Posts This Week
- Keep only "Connected Accounts" section
- Simplify account display by removing follower counts
- Focus only on adding/removing social media accounts

### 7. MainContent.tsx Adjustments
- Adjust padding and spacing to work without header
- Ensure proper full-height layout for chat page

## Component Changes Summary

### Files to Modify
1. `src/App.tsx` - Route changes
2. `src/components/layout/AppLayout.tsx` - Remove header
3. `src/components/layout/Sidebar.tsx` - Remove sessions and dashboard
4. `src/pages/ChatPage.tsx` - Redesign layout
5. `src/pages/DocumentsPage.tsx` - Simplify statistics
6. `src/pages/SocialPage.tsx` - Remove scheduled posts
7. `src/components/layout/MainContent.tsx` - Adjust spacing

### Files to Remove
1. `src/components/layout/Header.tsx` - No longer needed
2. `src/pages/DashboardPage.tsx` - No longer needed

## Implementation Order
1. Update routing in App.tsx
2. Modify AppLayout to remove header
3. Update Sidebar to remove sessions and dashboard
4. Redesign ChatPage with new layout
5. Simplify DocumentsPage
6. Simplify SocialPage
7. Adjust MainContent for new layout
8. Test all functionality

## Expected Outcome
After implementation, the application will have:
- Chat as the default screen after login
- Cleaner sidebar without chat sessions
- Chat page with integrated sessions panel
- Simplified Documents page with essential information only
- Streamlined Social Media page focused on account management
- No header, relying solely on sidebar navigation