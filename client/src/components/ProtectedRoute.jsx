import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Route that requires authentication
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div className="spinner spinner-lg"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Route that requires specific role
export const RoleGuard = ({ role, children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div className="spinner spinner-lg"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    // Redirect to appropriate dashboard
    const redirect = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
};

// Redirect authenticated users away from auth pages
export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div className="spinner spinner-lg"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (user) {
    const redirect = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
};
