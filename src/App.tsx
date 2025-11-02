import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import DocumentsPage from './pages/DocumentsPage';
import SocialPage from './pages/SocialPage';
import NotFoundPage from './pages/NotFoundPage';
import { AppLayout } from './components/layout';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <SettingsProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Navigate to="/chat" replace />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <AppLayout>
                  <ChatPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <AppLayout>
                  <DocumentsPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/social" element={
              <ProtectedRoute>
                <AppLayout>
                  <SocialPage />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </SettingsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;