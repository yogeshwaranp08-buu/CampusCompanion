import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleGuard, PublicRoute } from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AnnouncementsPage from './pages/AnnouncementsPage';
import EventsPage from './pages/EventsPage';
import NotesPage from './pages/NotesPage';
import LostFoundPage from './pages/LostFoundPage';
import ProfilePage from './pages/ProfilePage';
import AdminStudentsPage from './pages/AdminStudentsPage';
import ResumeBuilderPage from './pages/ResumeBuilderPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-sm)',
              boxShadow: 'var(--shadow-lg)',
            },
            success: {
              iconTheme: { primary: 'var(--color-green-600)', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: 'var(--color-red-600)', secondary: '#fff' },
            },
          }}
        />

        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/admin/login" element={<PublicRoute><AdminLoginPage /></PublicRoute>} />

          {/* Protected Routes with Layout */}
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            {/* Student Dashboard */}
            <Route path="student/dashboard" element={<RoleGuard role="student"><StudentDashboard /></RoleGuard>} />

            {/* Admin Dashboard */}
            <Route path="admin/dashboard" element={<RoleGuard role="admin"><AdminDashboard /></RoleGuard>} />

            {/* Admin Only */}
            <Route path="admin/students" element={<RoleGuard role="admin"><AdminStudentsPage /></RoleGuard>} />

            {/* Shared Routes (both roles) */}
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="lost-found" element={<LostFoundPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="resume-builder" element={<ResumeBuilderPage />} />

            {/* Default redirect */}
            <Route index element={<Navigate to="/login" replace />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
