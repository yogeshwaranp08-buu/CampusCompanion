import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { CampusHeroIllustration } from '../components/CampusIllustrations';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
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
      toast.success('Welcome back!');
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Hero Panel — Image Side */}
      <div className="auth-hero auth-hero-visual">
        {/* Decorative floating shapes */}
        <div className="auth-shape auth-shape-1" />
        <div className="auth-shape auth-shape-2" />
        <div className="auth-shape auth-shape-3" />

        {/* Campus Illustration */}
        <div className="auth-hero-image-wrap">
          <CampusHeroIllustration />
          {/* Overlay gradient for text readability */}
          <div className="auth-hero-image-overlay" />
        </div>

        {/* Branding over the illustration */}
        <div className="auth-hero-content">
          <div className="auth-hero-logo">CC</div>
          <h1>Campus Companion</h1>
          <p>Your complete digital campus hub — announcements, events, notes, lost &amp; found, and more.</p>
          <div className="college-name">Thiagarajar College of Engineering, Madurai</div>

          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat-number">5+</span>
              <span className="auth-stat-label">Features</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-number">24/7</span>
              <span className="auth-stat-label">Access</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-number">TCE</span>
              <span className="auth-stat-label">Exclusive</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-section">
        <div className="auth-form-container">
          <div className="auth-form-logo">CC</div>
          <div className="auth-form-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your campus account to continue</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                College Email <span className="required">*</span>
              </label>
              <input
                id="login-email"
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="yourname@student.tce.edu"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">
                Password <span className="required">*</span>
              </label>
              <div className="password-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '8px' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#fff' }} />
                  Signing in...
                </>
              ) : 'Sign In to Campus Companion'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register">Register as Student</Link></p>
            <p style={{ marginTop: '8px' }}>
              <Link to="/admin/login" style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                Admin Portal →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
