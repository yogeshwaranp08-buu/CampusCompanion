import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/dataService';
import LoadingSkeleton from '../components/LoadingSkeleton';
import {
  DashboardHeroIllustration,
  AnnouncementIllustration,
  EventIllustration,
  NotesIllustration,
  LostFoundIllustration,
} from '../components/CampusIllustrations';
import {
  HiOutlineSpeakerphone, HiOutlineCalendar, HiOutlineDocumentText,
  HiOutlineSearch, HiOutlineArrowRight, HiOutlineBookOpen,
  HiOutlineClock, HiOutlineLocationMarker, HiOutlineBell
} from 'react-icons/hi';

const StudentDashboard = () => {
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
  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="page-animate">
        <div className="skeleton" style={{ height: 160, borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-2xl)' }} />
        <LoadingSkeleton type="stats" count={4} />
        <LoadingSkeleton type="card" count={4} />
      </div>
    );
  }

  const quickCards = [
    {
      to: '/announcements', label: 'Announcements', icon: HiOutlineSpeakerphone,
      count: stats?.announcements || 0, desc: 'Campus notices & updates',
      bg: 'var(--navy-100)', color: 'var(--navy-700)',
      accent: 'linear-gradient(90deg, var(--navy-500), var(--navy-700))',
      illustration: <AnnouncementIllustration seed={0} />,
    },
    {
      to: '/events', label: 'Events', icon: HiOutlineCalendar,
      count: stats?.events || 0, desc: 'Upcoming campus events',
      bg: 'var(--sage-100)', color: 'var(--sage-700)',
      accent: 'linear-gradient(90deg, var(--sage-500), var(--sage-700))',
      illustration: <EventIllustration seed={1} />,
    },
    {
      to: '/notes', label: 'Study Notes', icon: HiOutlineDocumentText,
      count: stats?.notes || 0, desc: 'Academic materials',
      bg: 'var(--gold-100)', color: 'var(--gold-700)',
      accent: 'linear-gradient(90deg, var(--gold-400), var(--gold-600))',
      illustration: <NotesIllustration seed={0} />,
    },
    {
      to: '/lost-found', label: 'Lost & Found', icon: HiOutlineSearch,
      count: stats?.lostFound || 0, desc: 'Community board',
      bg: 'var(--teal-100)', color: 'var(--teal-700)',
      accent: 'linear-gradient(90deg, var(--teal-400), var(--teal-600))',
      illustration: <LostFoundIllustration category="Bags" type="Found" />,
    },
  ];

  return (
    <div className="page-animate">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-banner-inner">
          <div>
            <div className="welcome-greeting">
              {getGreeting()}, {user?.fullName?.split(' ')[0]}! 👋
            </div>
            <div className="welcome-sub">Here's what's happening around your campus today.</div>
            <div className="welcome-meta">
              {user?.department && <span className="welcome-chip"><HiOutlineBookOpen /> {user.department}</span>}
              {user?.year && <span className="welcome-chip"><HiOutlineClock /> {user.year}</span>}
              {user?.collegeId && <span className="welcome-chip">{user.collegeId}</span>}
            </div>
          </div>
          <Link to="/resume-builder" className="btn btn-accent">
            Resume Builder
          </Link>
        </div>
      </div>

      {/* Latest Announcement Notification Strip */}
      {recent?.announcements?.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 'var(--space-md)', padding: '12px 18px',
          background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.06), rgba(20, 166, 166, 0.08))',
          border: '1px solid var(--navy-200)', borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--space-xl)', flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              background: 'var(--navy-800)', color: '#fff', borderRadius: 'var(--radius-full)',
              width: '28px', height: '28px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '14px', flexShrink: 0
            }}>
              <HiOutlineBell />
            </span>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 'var(--font-bold)', color: 'var(--navy-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Latest Campus Broadcast · {formatDate(recent.announcements[0].createdAt)}
              </span>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>
                {recent.announcements[0].title}
              </div>
            </div>
          </div>
          <Link to="/announcements" className="btn btn-secondary btn-sm" style={{ alignSelf: 'center' }}>
            Read Notice <HiOutlineArrowRight />
          </Link>
        </div>
      )}

      {/* Quick Access Cards — with illustrations */}
      <div style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-title-accent" />
            Quick Access
          </h2>
        </div>
        <div className="visual-card-grid stagger-children">
          {quickCards.map((card) => (
            <Link key={card.to} to={card.to} className="visual-quick-card card-animate">
              {/* Illustration area */}
              <div className="visual-quick-card-image">
                {card.illustration}
                <div className="visual-quick-card-image-overlay" />
              </div>
              {/* Info area */}
              <div className="visual-quick-card-body">
                <div className="visual-quick-card-icon" style={{ background: card.bg, color: card.color }}>
                  <card.icon />
                </div>
                <div>
                  <div className="visual-quick-card-count">{card.count.toLocaleString()}</div>
                  <div className="visual-quick-card-label">{card.label}</div>
                  <div className="visual-quick-card-desc">{card.desc}</div>
                </div>
                <div className="visual-quick-card-arrow">
                  <HiOutlineArrowRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="dashboard-grid stagger-children">
        {/* Latest Announcements */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="section-title-accent" />
              Latest Announcements
            </h3>
            <Link to="/announcements" className="btn btn-ghost btn-sm">
              View All <HiOutlineArrowRight />
            </Link>
          </div>
          {recent?.announcements?.length > 0 ? (
            <div>
              {recent.announcements.map((a, i) => (
                <div key={a._id} style={{
                  padding: '12px 0',
                  borderBottom: i < recent.announcements.length - 1 ? '1px solid var(--border-light)' : 'none',
                  display: 'flex', gap: '10px', alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: 'var(--navy-100)', color: 'var(--navy-700)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0
                  }}>
                    <HiOutlineSpeakerphone />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: '4px', color: 'var(--text-primary)' }}>
                      {a.title}
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      <HiOutlineClock style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                      {formatDate(a.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', padding: 'var(--space-lg) 0' }}>
              No announcements yet.
            </p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="section-title-accent" />
              Upcoming Events
            </h3>
            <Link to="/events" className="btn btn-ghost btn-sm">
              View All <HiOutlineArrowRight />
            </Link>
          </div>
          {recent?.events?.length > 0 ? (
            <div>
              {recent.events.map((e, i) => {
                const d = new Date(e.date);
                return (
                  <div key={e._id} style={{
                    padding: '12px 0', display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-start',
                    borderBottom: i < recent.events.length - 1 ? '1px solid var(--border-light)' : 'none'
                  }}>
                    <div className="event-date-block">
                      <span className="day">{d.getDate()}</span>
                      <span className="month">{d.toLocaleString('en', { month: 'short' })}</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: '3px', color: 'var(--text-primary)' }}>
                        {e.title}
                      </h4>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <HiOutlineLocationMarker style={{ flexShrink: 0 }} /> {e.venue}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', padding: 'var(--space-lg) 0' }}>
              No upcoming events.
            </p>
          )}
        </div>

        {/* Recent Notes */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="section-title-accent" />
              Recent Notes
            </h3>
            <Link to="/notes" className="btn btn-ghost btn-sm">
              View All <HiOutlineArrowRight />
            </Link>
          </div>
          {recent?.notes?.length > 0 ? (
            <div>
              {recent.notes.map((n, i) => (
                <div key={n._id} style={{
                  padding: '12px 0',
                  borderBottom: i < recent.notes.length - 1 ? '1px solid var(--border-light)' : 'none',
                  display: 'flex', gap: '10px', alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: 'var(--gold-100)', color: 'var(--gold-700)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0
                  }}>
                    <HiOutlineDocumentText />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: '3px', color: 'var(--text-primary)' }}>
                      {n.title}
                    </h4>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                      {n.subject} · {n.department}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', padding: 'var(--space-lg) 0' }}>
              No notes available.
            </p>
          )}
        </div>

        {/* Lost & Found */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="section-title-accent" />
              Lost &amp; Found
            </h3>
            <Link to="/lost-found" className="btn btn-ghost btn-sm">
              View All <HiOutlineArrowRight />
            </Link>
          </div>
          {recent?.lostFound?.length > 0 ? (
            <div>
              {recent.lostFound.map((item, i) => (
                <div key={item._id} style={{
                  padding: '12px 0',
                  borderBottom: i < recent.lostFound.length - 1 ? '1px solid var(--border-light)' : 'none',
                  display: 'flex', gap: '10px', alignItems: 'flex-start'
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                    background: item.type === 'Lost' ? 'var(--coral-100)' : 'var(--sage-100)',
                    color: item.type === 'Lost' ? 'var(--coral-700)' : 'var(--sage-700)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', flexShrink: 0, fontWeight: 'var(--font-bold)',
                    letterSpacing: '0.03em'
                  }}>
                    {item.type === 'Lost' ? '📍' : '✅'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span className={`badge ${item.type === 'Lost' ? 'badge-red' : 'badge-green'}`}>{item.type}</span>
                      <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
                        {item.itemName}
                      </h4>
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <HiOutlineLocationMarker style={{ flexShrink: 0 }} /> {item.location} · {formatDate(item.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', padding: 'var(--space-lg) 0' }}>
              No lost &amp; found posts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
