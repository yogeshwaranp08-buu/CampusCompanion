import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/dataService';
import toast from 'react-hot-toast';
import {
  HiOutlineBell,
  HiOutlineSpeakerphone,
  HiOutlineCalendar,
  HiOutlineDocumentText,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineExternalLink
} from 'react-icons/hi';

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const getIconForType = (type) => {
  switch (type) {
    case 'announcement':
      return <HiOutlineSpeakerphone className="notification-item-icon announcement" />;
    case 'event':
      return <HiOutlineCalendar className="notification-item-icon event" />;
    case 'note':
      return <HiOutlineDocumentText className="notification-item-icon note" />;
    default:
      return <HiOutlineBell className="notification-item-icon general" />;
  }
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const prevCountRef = useRef(0);
  const isFirstLoad = useRef(true);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async (showToastOnNew = true) => {
    try {
      const { data } = await notificationService.getAll({ page: 1, limit: 15 });
      if (data.success) {
        setNotifications(data.notifications || []);
        const count = data.unreadCount || 0;

        // If new unread notification arrived after initial load, pop a toast notification
        if (showToastOnNew && !isFirstLoad.current && count > prevCountRef.current && data.notifications?.length > 0) {
          const newest = data.notifications[0];
          toast((t) => (
            <div
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
              onClick={() => {
                toast.dismiss(t.id);
                navigate('/announcements');
              }}
            >
              <div style={{
                background: 'var(--navy-800)',
                color: '#fff',
                borderRadius: '50%',
                padding: '6px',
                display: 'flex'
              }}>
                <HiOutlineSpeakerphone size={18} />
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '13px' }}>{newest.title}</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {newest.message.length > 55 ? newest.message.substring(0, 55) + '...' : newest.message}
                </span>
              </div>
            </div>
          ), {
            duration: 6000,
            position: 'top-right',
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
            }
          });
        }

        prevCountRef.current = count;
        setUnreadCount(count);
        isFirstLoad.current = false;
      }
    } catch {
      // Background poll silently fails
    }
  }, [navigate]);

  useEffect(() => {
    fetchNotifications(false);
    // Poll for new notifications every 15 seconds
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications(false);
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      prevCountRef.current = Math.max(0, prevCountRef.current - 1);
    } catch {
      toast.error('Could not mark as read.');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    setLoading(true);
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      prevCountRef.current = 0;
      toast.success('All notifications marked as read.');
    } catch {
      toast.error('Failed to mark all as read.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await notificationService.delete(id);
      const removed = notifications.find((n) => n._id === id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (removed && !removed.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
        prevCountRef.current = Math.max(0, prevCountRef.current - 1);
      }
    } catch {
      toast.error('Failed to remove notification.');
    }
  };

  const handleItemClick = async (notif) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif._id);
    }
    setIsOpen(false);
    if (notif.type === 'announcement') {
      navigate('/announcements');
    } else if (notif.type === 'event') {
      navigate('/events');
    } else if (notif.type === 'note') {
      navigate('/notes');
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className={`notification-bell-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={handleToggle}
        aria-label="Notifications"
        title={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
      >
        <HiOutlineBell className="notification-bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge-pulse">
            <span className="notification-badge-number">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <div className="notification-header-title">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="notification-unread-tag">{unreadCount} new</span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                className="btn-mark-all-read"
                onClick={handleMarkAllAsRead}
                disabled={loading}
              >
                <HiOutlineCheck /> Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <div className="notification-empty-icon">🔔</div>
                <div className="notification-empty-title">All caught up!</div>
                <div className="notification-empty-desc">
                  You have no notifications right now.
                </div>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`notification-item ${!notif.isRead ? 'unread' : 'read'}`}
                  onClick={() => handleItemClick(notif)}
                >
                  <div className="notification-item-avatar">
                    {getIconForType(notif.type)}
                  </div>
                  <div className="notification-item-content">
                    <div className="notification-item-header">
                      <span className="notification-item-title">{notif.title}</span>
                      <span className="notification-item-time">{timeAgo(notif.createdAt)}</span>
                    </div>
                    <p className="notification-item-msg">{notif.message}</p>
                    <div className="notification-item-footer">
                      <span className="notification-item-action">
                        View details <HiOutlineExternalLink style={{ fontSize: '11px' }} />
                      </span>
                    </div>
                  </div>
                  <div className="notification-item-actions" onClick={(e) => e.stopPropagation()}>
                    {!notif.isRead && (
                      <button
                        className="notification-action-btn"
                        onClick={(e) => handleMarkAsRead(notif._id, e)}
                        title="Mark as read"
                      >
                        <HiOutlineCheck />
                      </button>
                    )}
                    <button
                      className="notification-action-btn delete"
                      onClick={(e) => handleDelete(notif._id, e)}
                      title="Dismiss"
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="notification-dropdown-footer">
            <button
              className="notification-footer-link"
              onClick={() => {
                setIsOpen(false);
                navigate('/announcements');
              }}
            >
              View All Campus Announcements →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
