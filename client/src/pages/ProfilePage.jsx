import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/dataService';
import toast from 'react-hot-toast';
import { HiOutlinePencil, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';

const DEPARTMENTS = [
  'Computer Science and Engineering', 'Information Technology',
  'Electronics and Communication Engineering', 'Electrical and Electronics Engineering',
  'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
  'Production Engineering', 'Other'
];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'];

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '', department: '', year: '', phone: ''
  });

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || '',
        department: user.department || '',
        year: user.year || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      toast.error('Full name is required.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await userService.update(user._id, form);
      if (data.success) {
        setUser(data.user);
        toast.success('Profile updated successfully.');
        setEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return null;

  return (
    <div className="page-animate">
      <div className="page-header">
        <div>
          <h1>Profile</h1>
          <p>Manage your account information</p>
        </div>
        {!editing ? (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            <HiOutlinePencil /> Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-secondary" onClick={() => { setEditing(false); setForm({ fullName: user.fullName, department: user.department, year: user.year, phone: user.phone || '' }); }}>
              <HiOutlineX /> Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              {loading && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }}></span>}
              <HiOutlineCheck /> Save
            </button>
          </div>
        )}
      </div>

      <div className="profile-card-container">
        <div className="profile-cover-banner" />
        <div className="profile-header">
          <div className="profile-avatar">{getInitials(user.fullName)}</div>
          <div className="profile-info">
            <h2>{user.fullName}</h2>
            <p>{user.email} · <span className="badge badge-blue" style={{ textTransform: 'capitalize' }}>{user.role}</span></p>
          </div>
        </div>

      <div className="profile-details">
        <div className="profile-field">
          <div className="profile-field-label">Full Name</div>
          {editing ? (
            <input type="text" className="form-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          ) : (
            <div className="profile-field-value">{user.fullName}</div>
          )}
        </div>

        <div className="profile-field">
          <div className="profile-field-label">College ID</div>
          <div className="profile-field-value">{user.collegeId}</div>
        </div>

        <div className="profile-field">
          <div className="profile-field-label">Email</div>
          <div className="profile-field-value">{user.email}</div>
        </div>

        <div className="profile-field">
          <div className="profile-field-label">Department</div>
          {editing ? (
            <select className="form-select" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
              <option value="">Select Department</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          ) : (
            <div className="profile-field-value">{user.department || '—'}</div>
          )}
        </div>

        <div className="profile-field">
          <div className="profile-field-label">Year</div>
          {editing ? (
            <select className="form-select" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
              <option value="">Select Year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          ) : (
            <div className="profile-field-value">{user.year || '—'}</div>
          )}
        </div>

        <div className="profile-field">
          <div className="profile-field-label">Phone</div>
          {editing ? (
            <input type="tel" className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit phone" />
          ) : (
            <div className="profile-field-value">{user.phone || '—'}</div>
          )}
        </div>

        <div className="profile-field">
          <div className="profile-field-label">Role</div>
          <div className="profile-field-value" style={{ textTransform: 'capitalize' }}>{user.role}</div>
        </div>

        <div className="profile-field">
          <div className="profile-field-label">Joined</div>
          <div className="profile-field-value">{new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
