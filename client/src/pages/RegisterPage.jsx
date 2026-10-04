import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/dataService';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { LibraryIllustration } from '../components/CampusIllustrations';

const DEPARTMENTS = [
  'Computer Science and Engineering',
  'Information Technology',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Chemical Engineering',
  'Production Engineering',
  'Other'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullName: '', collegeId: '', email: '', password: '', confirmPassword: '',
    department: '', year: '', phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.';
    if (!form.collegeId.trim()) errs.collegeId = 'College ID is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!form.email.endsWith('@student.tce.edu')) errs.email = 'Only @student.tce.edu emails are allowed.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (!form.department) errs.department = 'Department is required.';
    if (!form.year) errs.year = 'Year is required.';
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit phone number.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      const { data } = await authService.register(submitData);
      toast.success(data.message || 'Registration successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero auth-hero-visual">
        <div className="auth-shape auth-shape-1" />
        <div className="auth-shape auth-shape-2" />
        <div className="auth-shape auth-shape-3" />

        {/* Library Illustration */}
        <div className="auth-hero-image-wrap">
          <LibraryIllustration />
          <div className="auth-hero-image-overlay" />
        </div>

        <div className="auth-hero-content">
          <div className="auth-hero-logo">CC</div>
          <h1>Join Campus Companion</h1>
          <p>Create your student account to access academic resources, stay updated with campus announcements, and connect with your college community.</p>
          <div className="college-name">Thiagarajar College of Engineering, Madurai</div>

          <div className="auth-feature-badges">
            <div className="auth-feature-badge">
              <span className="auth-feature-icon">🎓</span>
              <span>Free Forever</span>
            </div>
            <div className="auth-feature-badge">
              <span className="auth-feature-icon">🔐</span>
              <span>TCE Verified</span>
            </div>
            <div className="auth-feature-badge">
              <span className="auth-feature-icon">📖</span>
              <span>Digital Library</span>
            </div>
            <div className="auth-feature-badge">
              <span className="auth-feature-icon">🏫</span>
              <span>Campus Connect</span>
            </div>
          </div>

          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat-number">Free</span>
              <span className="auth-stat-label">Always</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-number">TCE</span>
              <span className="auth-stat-label">Verified</span>
            </div>
            <div className="auth-stat">
              <span className="auth-stat-number">5+</span>
              <span className="auth-stat-label">Features</span>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-section" style={{ overflowY: 'auto' }}>
        <div className="auth-form-container" style={{ maxWidth: '480px' }}>
          <div className="auth-form-header">
            <h2>Student Registration</h2>
            <p>Create your TCE student account</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full Name <span className="required">*</span></label>
                <input id="reg-name" name="fullName" type="text" className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="John Doe" value={form.fullName} onChange={handleChange} />
                {errors.fullName && <div className="form-error">{errors.fullName}</div>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-id">College ID <span className="required">*</span></label>
                <input id="reg-id" name="collegeId" type="text" className={`form-input ${errors.collegeId ? 'error' : ''}`}
                  placeholder="23IT001" value={form.collegeId} onChange={handleChange} />
                {errors.collegeId && <div className="form-error">{errors.collegeId}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">College Email <span className="required">*</span></label>
              <input id="reg-email" name="email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="23it001@student.tce.edu" value={form.email} onChange={handleChange} />
              {errors.email && <div className="form-error">{errors.email}</div>}
              <div className="form-hint">Must end with @student.tce.edu</div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password <span className="required">*</span></label>
                <div className="password-wrapper">
                  <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'error' : ''}`} placeholder="Min. 6 characters"
                    value={form.password} onChange={handleChange} />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                  </button>
                </div>
                {errors.password && <div className="form-error">{errors.password}</div>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirm Password <span className="required">*</span></label>
                <input id="reg-confirm" name="confirmPassword" type="password" className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} />
                {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-dept">Department <span className="required">*</span></label>
                <select id="reg-dept" name="department" className={`form-select ${errors.department ? 'error' : ''}`}
                  value={form.department} onChange={handleChange}>
                  <option value="">Select Department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <div className="form-error">{errors.department}</div>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-year">Year <span className="required">*</span></label>
                <select id="reg-year" name="year" className={`form-select ${errors.year ? 'error' : ''}`}
                  value={form.year} onChange={handleChange}>
                  <option value="">Select Year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                {errors.year && <div className="form-error">{errors.year}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Phone Number</label>
              <input id="reg-phone" name="phone" type="tel" className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="10-digit phone number" value={form.phone} onChange={handleChange} />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: '#fff' }}></span>
                  Creating Account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
