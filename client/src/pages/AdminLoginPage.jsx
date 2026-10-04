import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { AdminHeroIllustration } from '../components/CampusIllustrations';

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Admin email is required.';
    if (!form.password) errs.password = 'Password is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await login(form);
      if (data.user.role !== 'admin') {
        toast.error('This login is for administrators only.');
        return;
      }
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero auth-hero-visual">
        <div className="auth-shape auth-shape-1" />
        <div className="auth-shape auth-shape-2" />
        <div className="auth-shape auth-shape-3" />

        <div className="auth-hero-image-wrap">
          <AdminHeroIllustration />
          <div className="auth-hero-image-overlay" />
        </div>

        <div className="auth-hero-content">
          <div className="auth-hero-logo">CC</div>
          <h1>Administration</h1>
          <p>Secure administrative access to Campus Companion management dashboard.</p>
          <div className="college-name">Thiagarajar College of Engineering, Madurai</div>

          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat-number">Admin</span>
              <span className="auth-stat-label">Portal</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-number">100%</span>
              <span className="auth-stat-label">Secure</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-number">Live</span>
              <span className="auth-stat-label">Control</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Admin Login</h2>
            <p>Sign in with your administrator credentials</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">Admin Email <span className="required">*</span></label>
              <input id="admin-email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="admin@tce.edu" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">Password <span className="required">*</span></label>
              <div className="password-wrapper">
                <input id="admin-password" type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Enter admin password"
                  value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#fff' }}></span>
                  Signing in...
                </>
              ) : 'Admin Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p><Link to="/login">← Back to Student Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
