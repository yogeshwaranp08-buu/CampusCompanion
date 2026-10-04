import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/dataService';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { AdminHeroIllustration } from '../components/CampusIllustrations';
import {
  HiOutlineUsers, HiOutlineSpeakerphone, HiOutlineCalendar,
  HiOutlineDocumentText, HiOutlineSearch, HiOutlineArrowRight,
  HiOutlineClock, HiOutlineLocationMarker
} from 'react-icons/hi';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await userService.getDashboardStats();
        if (data.success) {
          setStats(data.stats);
          setRecent(data.recent);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <div className="page-animate">
        <div className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-2xl)' }} />
        <LoadingSkeleton type="stats" count={5} />
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Students', value: stats?.students || 0, icon: HiOutlineUsers, bg: 'var(--navy-100)', color: 'var(--navy-700)', to: '/admin/students' },
    { label: 'Announcements', value: stats?.announcements || 0, icon: HiOutlineSpeakerphone, bg: 'var(--gold-100)', color: 'var(--gold-700)', to: '/announcements' },
    { label: 'Events', value: stats?.events || 0, icon: HiOutlineCalendar, bg: 'var(--sage-100)', color: 'var(--sage-700)', to: '/events' },
    { label: 'Notes', value: stats?.notes || 0, icon: HiOutlineDocumentText, bg: 'var(--lavender-100)', color: 'var(--lavender-700)', to: '/notes' },
    { label: 'Lost & Found', value: stats?.lostFound || 0, icon: HiOutlineSearch, bg: 'var(--coral-100)', color: 'var(--coral-700)', to: '/lost-found' },
  ];

  return (
    <div className="page-animate">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-banner-inner">
          <div>
            <div className="welcome-greeting">Admin Dashboard</div>
            <div className="welcome-sub">Welcome back, {user?.fullName}. Here's an overview of Campus Companion.</div>
            <div className="welcome-meta">
              <span className="welcome-chip">Administrator</span>
              <span className="welcome-chip">TCE Campus Portal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-title-accent" />
            Platform Overview
          </h2>
        </div>
        <div className="stats-grid stagger-children">
          {statCards.map((s) => (
            <Link key={s.label} to={s.to} style={{ textDecoration: 'none' }}>
              <div className="stat-card card-animate">
                <div className="stat-card-icon" style={{ background: s.bg, color: s.color }}>
                  <s.icon />
                </div>
                <div className="stat-card-info">
                  <h3>{s.value.toLocaleString()}</h3>
                  <p>{s.label}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Student Distribution Stats */}
      {(stats?.departmentStats && Object.keys(stats.departmentStats).length > 0) && (
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-title-accent" />
              Student Distribution
            </h2>
          </div>
          <div className="dashboard-grid">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">By Department</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(stats.departmentStats).map(([dept, count]) => {
                  const maxCount = Math.max(...Object.values(stats.departmentStats));
                  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  const abbr = dept.replace(/ and /g, ' & ').split(' ').map(w => w[0]).join('');
                  return (
                    <div key={dept}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 'var(--font-medium)' }} title={dept}>{abbr}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{count}</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gradient-primary)', borderRadius: 99, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">By Year</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(stats.yearStats || {}).map(([yr, count]) => {
                  const maxCount = Math.max(...Object.values(stats.yearStats));
                  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={yr}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 'var(--font-medium)' }}>{yr}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{count}</span>
                      </div>
                      <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gradient-secondary)', borderRadius: 99, transition: 'width 0.6s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Management Shortcuts */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-title-accent" />
            Quick Actions
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', padding: 'var(--space-md)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xs)' }}>
          <Link to="/announcements" className="btn btn-primary btn-sm"><HiOutlineSpeakerphone /> Manage Announcements</Link>
          <Link to="/events"        className="btn btn-primary btn-sm"><HiOutlineCalendar /> Manage Events</Link>
          <Link to="/notes"         className="btn btn-primary btn-sm"><HiOutlineDocumentText /> Manage Notes</Link>
          <Link to="/lost-found"    className="btn btn-primary btn-sm"><HiOutlineSearch /> Manage Lost &amp; Found</Link>
          <Link to="/admin/students" className="btn btn-secondary btn-sm"><HiOutlineUsers /> Manage Students</Link>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="section-title-accent" />
              Latest Announcements
            </h3>
            <Link to="/announcements" className="btn btn-ghost btn-sm">View All <HiOutlineArrowRight /></Link>
          </div>
          {recent?.announcements?.length > 0 ? (
            <div>
              {recent.announcements.map((a, i) => (
                <div key={a._id} style={{ padding: '12px 0', borderBottom: i < recent.announcements.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: '4px' }}>{a.title}</h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    <HiOutlineClock style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                    {formatDate(a.createdAt)} {a.createdBy ? `· by ${a.createdBy.fullName}` : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', padding: 'var(--space-lg) 0' }}>No announcements yet. Create your first announcement.</p>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="section-title-accent" />
              Upcoming Events
            </h3>
            <Link to="/events" className="btn btn-ghost btn-sm">View All <HiOutlineArrowRight /></Link>
          </div>
          {recent?.events?.length > 0 ? (
            <div>
              {recent.events.map((e, i) => {
                const d = new Date(e.date);
                return (
                  <div key={e._id} style={{ padding: '12px 0', display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start', borderBottom: i < recent.events.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <div className="event-date-block">
                      <span className="day">{d.getDate()}</span>
                      <span className="month">{d.toLocaleString('en', { month: 'short' })}</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: '3px' }}>{e.title}</h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <HiOutlineLocationMarker style={{ flexShrink: 0 }} /> {e.venue}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', padding: 'var(--space-lg) 0' }}>No upcoming events.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
