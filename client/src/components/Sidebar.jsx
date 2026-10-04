import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineSpeakerphone,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineUsers,
  HiOutlineX,
  HiOutlineDocumentDuplicate
} from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const basePath = isAdmin ? '/admin' : '/student';

  const navItems = [
    { to: `${basePath}/dashboard`, label: 'Dashboard', icon: HiOutlineHome },
    { to: '/announcements', label: 'Announcements', icon: HiOutlineSpeakerphone },
    { to: '/events', label: 'Events', icon: HiOutlineCalendar },
    { to: '/notes', label: 'Notes', icon: HiOutlineDocumentText },
    { to: '/lost-found', label: 'Lost & Found', icon: HiOutlineSearch },
    { to: '/resume-builder', label: 'Resume Builder', icon: HiOutlineDocumentDuplicate },
  ];

  const adminItems = isAdmin ? [
    { to: '/admin/students', label: 'Students', icon: HiOutlineUsers },
  ] : [];

  const userItems = [
    { to: '/profile', label: 'Profile', icon: HiOutlineUser },
  ];

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">CC</div>
          <div className="sidebar-brand-text">
            <h2>Campus Companion</h2>
            <span>Your Digital Campus Hub</span>
          </div>
          <button className="modal-close" onClick={onClose} style={{ display: isOpen ? 'block' : 'none', marginLeft: 'auto', color: 'rgba(255,255,255,0.6)' }}>
            <HiOutlineX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Main Menu</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon className="icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          {adminItems.length > 0 && (
            <>
              <div className="sidebar-section-label">Administration</div>
              {adminItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon className="icon" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </>
          )}

          <div className="sidebar-section-label">Account</div>
          {userItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <item.icon className="icon" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}>
            <HiOutlineLogout className="icon" />
            <span>Logout</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{getInitials(user?.fullName)}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.fullName}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
