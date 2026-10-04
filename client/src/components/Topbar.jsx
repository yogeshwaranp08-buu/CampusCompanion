import { useAuth } from '../context/AuthContext';
import { HiOutlineMenu } from 'react-icons/hi';
import NotificationBell from './NotificationBell';

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const Topbar = ({ title, subtitle, onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
          <HiOutlineMenu />
        </button>
        <div>
          <h1 className="topbar-title">{title || 'Dashboard'}</h1>
          {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
        </div>
      </div>
      <div className="topbar-right">
        {user && <NotificationBell />}
        <div className="topbar-user-chip">
          <div className="topbar-user-avatar">
            {getInitials(user?.fullName)}
          </div>
          <span className="topbar-user-email">{user?.email}</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
