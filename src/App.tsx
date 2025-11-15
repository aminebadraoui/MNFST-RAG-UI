import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { RoutePreserver, ProtectedRoute, RoleBasedRoute } from './components/auth';
import LoginPage from './pages/LoginPage';
import ChatBotsPage from './pages/ChatBotsPage';
import ChatInterface from './pages/ChatInterface';
import DocumentsPage from './pages/DocumentsPage';
import SocialPage from './pages/SocialPage';
import SettingsPage from './pages/SettingsPage';
import TenantsPage from './pages/TenantsPage';
import UsersPage from './pages/UsersPage';
import NotFoundPage from './pages/NotFoundPage';
import { AppLayout } from './components/layout';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <SettingsProvider>
          <RoutePreserver>
            <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <RoleBasedRoute
                    roles={['superadmin']}
                    element={<Navigate to="/tenants" replace />}
                    fallback={<Navigate to="/chat" replace />}
                  />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <AppLayout>
                  <RoleBasedRoute
                    roles={['superadmin', 'tenant_admin', 'user']}
                    element={<ChatBotsPage />}
                    fallback={<Navigate to="/chat" replace />}
                  />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/chat/:chatId" element={
              <ProtectedRoute>
                <AppLayout>
                  <RoleBasedRoute
                    roles={['superadmin', 'tenant_admin', 'user']}
                    element={<ChatInterface />}
                    fallback={<Navigate to="/chat" replace />}
                  />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <AppLayout>
                  <RoleBasedRoute
                    roles={['superadmin', 'tenant_admin']}
                    element={<DocumentsPage />}
                    fallback={<Navigate to="/chat" replace />}
                  />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/social" element={
              <ProtectedRoute>
                <AppLayout>
                  <RoleBasedRoute
                    roles={['superadmin', 'tenant_admin']}
                    element={<SocialPage />}
                    fallback={<Navigate to="/chat" replace />}
                  />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <AppLayout>
                  <RoleBasedRoute
                    roles={['superadmin', 'tenant_admin', 'user']}
                    element={<SettingsPage />}
                    fallback={<Navigate to="/chat" replace />}
                  />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/tenants" element={
              <ProtectedRoute>
                <AppLayout>
                  <RoleBasedRoute
                    roles={['superadmin']}
                    element={<TenantsPage />}
                    fallback={<Navigate to="/chat" replace />}
                  />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <AppLayout>
                  <RoleBasedRoute
                    roles={['superadmin', 'tenant_admin']}
                    element={<UsersPage />}
                    fallback={<Navigate to="/chat" replace />}
                  />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          </RoutePreserver>
        </SettingsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;