import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const PAGE_META = {
  '/student/dashboard': { title: 'Dashboard', subtitle: 'Your campus overview' },
  '/admin/dashboard':   { title: 'Dashboard', subtitle: 'Platform administration' },
  '/announcements':     { title: 'Announcements', subtitle: 'Campus notices & updates' },
  '/events':            { title: 'Events', subtitle: 'Discover campus events' },
  '/notes':             { title: 'Study Notes', subtitle: 'Academic resources & materials' },
  '/lost-found':        { title: 'Lost & Found', subtitle: 'Community board' },
  '/resume-builder':    { title: 'Resume Builder', subtitle: 'Build your professional resume' },
  '/profile':           { title: 'My Profile', subtitle: 'Account settings' },
  '/admin/students':    { title: 'Students', subtitle: 'Manage student accounts' },
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const meta = PAGE_META[location.pathname] || { title: 'Campus Companion', subtitle: '' };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="page-wrapper page-animate">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
