import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { announcementService } from '../services/dataService';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { AnnouncementIllustration, EmptyStateIllustration } from '../components/CampusIllustrations';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash,
  HiOutlineSpeakerphone, HiOutlinePaperClip, HiOutlineBell,
  HiOutlineCalendar, HiOutlineClock, HiOutlineLocationMarker,
  HiOutlineArrowLeft, HiOutlineSortDescending, HiOutlineFilter
} from 'react-icons/hi';

const CATEGORIES = ['All', 'Academic', 'Exam', 'Event', 'Placement', 'Workshop', 'General'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'deadline_soonest', label: 'Deadline Soonest' },
  { value: 'deadline_latest', label: 'Deadline Latest' },
  { value: 'event_soonest', label: 'Event Date Soonest' },
  { value: 'event_latest', label: 'Event Date Latest' },
];

const AnnouncementsPage = () => {
  const { isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'General',
    eventName: '', registrationStart: '', registrationDeadline: '',
    eventDate: '', eventTime: '', venue: '', organizer: ''
  });
  const [sendNotification, setSendNotification] = useState(true);
  const [file, setFile] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Detail view
  const [viewDetail, setViewDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search, page, limit: 12, sort };
      if (category) params.category = category;
      const { data } = await announcementService.getAll(params);
      if (data.success) {
        setAnnouncements(data.announcements);
        setPagination(data.pagination);
      }
    } catch {
      toast.error('Failed to load announcements.');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  const handleSearch = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => { setSearch(value); setPage(1); }, 400));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: '', description: '', category: 'General',
      eventName: '', registrationStart: '', registrationDeadline: '',
      eventDate: '', eventTime: '', venue: '', organizer: ''
    });
    setSendNotification(true);
    setFile(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title, description: item.description,
      category: item.category || 'General',
      eventName: item.eventName || '',
      registrationStart: item.registrationStart ? item.registrationStart.split('T')[0] : '',
      registrationDeadline: item.registrationDeadline ? item.registrationDeadline.split('T')[0] : '',
      eventDate: item.eventDate ? item.eventDate.split('T')[0] : '',
      eventTime: item.eventTime || '',
      venue: item.venue || '',
      organizer: item.organizer || ''
    });
    setSendNotification(false);
    setFile(null);
    setShowModal(true);
  };

  const openDetail = async (item) => {
    setDetailLoading(true);
    setViewDetail(item);
    try {
      const { data } = await announcementService.getOne(item._id);
      if (data.success) setViewDetail(data.announcement);
    } catch {
      // Use already-loaded data
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v); });
      if (file) formData.append('attachment', file);

      if (editing) {
        await announcementService.update(editing._id, formData);
        toast.success('Announcement updated successfully.');
      } else {
        await announcementService.create(formData);
        toast.success('Announcement created successfully.');
      }
      setShowModal(false);
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await announcementService.delete(deleteTarget._id);
      toast.success('Announcement deleted successfully.');
      setDeleteTarget(null);
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const formatDateTime = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  const getRegistrationStatus = (ann) => {
    if (!ann.registrationDeadline) return null;
    const now = new Date();
    const deadline = new Date(ann.registrationDeadline);
    const regStart = ann.registrationStart ? new Date(ann.registrationStart) : null;
    if (regStart && now < regStart) return { status: 'upcoming', label: 'Registration Not Started', color: 'var(--text-muted)' };
    if (now <= deadline) {
      const hoursLeft = (deadline - now) / (1000 * 60 * 60);
      if (hoursLeft <= 24) return { status: 'closing', label: 'Registration Closing Soon', color: 'var(--gold-600)' };
      return { status: 'open', label: 'Registration Open', color: 'var(--sage-600)' };
    }
    return { status: 'closed', label: 'Registration Closed', color: 'var(--coral-600)' };
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'Academic': 'badge-blue', 'Exam': 'badge-red', 'Event': 'badge-teal',
      'Placement': 'badge-gold', 'Workshop': 'badge-purple', 'General': 'badge-gray'
    };
    return colors[cat] || 'badge-gray';
  };

  // Detail view
  if (viewDetail) {
    const regStatus = getRegistrationStatus(viewDetail);
    return (
      <div className="page-animate">
        <button className="btn btn-ghost btn-sm" onClick={() => setViewDetail(null)} style={{ marginBottom: 'var(--space-lg)' }}>
          <HiOutlineArrowLeft /> Back to Announcements
        </button>

        <div className="announcement-detail-card card">
          <div className="announcement-detail-header">
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-sm)' }}>
              <span className={`badge ${getCategoryColor(viewDetail.category)}`}>{viewDetail.category || 'General'}</span>
              {regStatus && <span className="badge" style={{ background: regStatus.color + '18', color: regStatus.color, fontSize: '0.7rem' }}>{regStatus.label}</span>}
            </div>
            <h1 className="announcement-detail-title">{viewDetail.title}</h1>
            <div className="announcement-detail-meta">
              <span><HiOutlineClock /> Published {formatDateTime(viewDetail.createdAt)}</span>
              {viewDetail.createdBy && <span>by {viewDetail.createdBy.fullName}</span>}
            </div>
          </div>

          <div className="announcement-detail-body">
            {/* Event info grid */}
            {(viewDetail.eventName || viewDetail.eventDate || viewDetail.venue || viewDetail.organizer) && (
              <div className="announcement-event-info">
                {viewDetail.eventName && (
                  <div className="announcement-event-field">
                    <span className="announcement-event-label"><HiOutlineCalendar /> Event</span>
                    <span className="announcement-event-value">{viewDetail.eventName}</span>
                  </div>
                )}
                {viewDetail.eventDate && (
                  <div className="announcement-event-field">
                    <span className="announcement-event-label"><HiOutlineCalendar /> Event Date</span>
                    <span className="announcement-event-value">{formatDateTime(viewDetail.eventDate)}</span>
                  </div>
                )}
                {viewDetail.eventTime && (
                  <div className="announcement-event-field">
                    <span className="announcement-event-label"><HiOutlineClock /> Time</span>
                    <span className="announcement-event-value">{viewDetail.eventTime}</span>
                  </div>
                )}
                {viewDetail.venue && (
                  <div className="announcement-event-field">
                    <span className="announcement-event-label"><HiOutlineLocationMarker /> Venue</span>
                    <span className="announcement-event-value">{viewDetail.venue}</span>
                  </div>
                )}
                {viewDetail.organizer && (
                  <div className="announcement-event-field">
                    <span className="announcement-event-label"><HiOutlineSpeakerphone /> Organizer</span>
                    <span className="announcement-event-value">{viewDetail.organizer}</span>
                  </div>
                )}
                {viewDetail.registrationStart && (
                  <div className="announcement-event-field">
                    <span className="announcement-event-label"><HiOutlineCalendar /> Reg. Start</span>
                    <span className="announcement-event-value">{formatDateTime(viewDetail.registrationStart)}</span>
                  </div>
                )}
                {viewDetail.registrationDeadline && (
                  <div className="announcement-event-field">
                    <span className="announcement-event-label"><HiOutlineClock /> Reg. Deadline</span>
                    <span className="announcement-event-value" style={{ color: regStatus?.color }}>{formatDateTime(viewDetail.registrationDeadline)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="announcement-detail-description">
              {viewDetail.description.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {viewDetail.attachment?.fileName && (
              <div className="announcement-attachment">
                <HiOutlinePaperClip />
                <a href={`/${viewDetail.attachment.fileUrl}`} target="_blank" rel="noopener noreferrer">
                  {viewDetail.attachment.fileName}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-animate">
      <div className="page-header">
        <div>
          <h1>Announcements</h1>
          <p>Stay updated with the latest campus notices and updates</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openCreate}>
            <HiOutlinePlus /> Post Announcement
          </button>
        )}
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <HiOutlineSearch className="search-icon" />
          <input type="text" placeholder="Search announcements..." onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={category} onChange={(e) => { setCategory(e.target.value === 'All' ? '' : e.target.value); setPage(1); }}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Notification Broadcast Status Banner */}
      <div className="notification-setup-banner">
        <div className="notification-setup-icon">
          <HiOutlineBell />
        </div>
        <div className="notification-setup-content">
          <div className="notification-setup-title">
            <span>Instant Campus Notification Broadcast</span>
            <span className="badge badge-green" style={{ fontSize: '11px', padding: '2px 8px' }}>Active</span>
          </div>
          <p className="notification-setup-desc">
            {isAdmin
              ? 'New announcements automatically trigger instant notifications to all registered students.'
              : ''}
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : announcements.length === 0 ? (
        <EmptyState
          icon={HiOutlineSpeakerphone}
          title="No announcements yet"
          message={isAdmin ? 'Create your first announcement to keep students informed.' : 'No announcements have been posted yet.'}
          showAction={isAdmin}
          actionLabel="Create Announcement"
          onAction={openCreate}
          customIllustration={<EmptyStateIllustration type="announcements" />}
        />
      ) : (
        <>
          <div className="content-grid">
            {announcements.map((a, idx) => {
              const regStatus = getRegistrationStatus(a);
              return (
                <div key={a._id} className="notice-card visual-content-card card-animate" onClick={() => openDetail(a)} style={{ cursor: 'pointer' }}>
                  {/* Illustration thumbnail */}
                  <div className="visual-card-thumbnail">
                    <AnnouncementIllustration seed={idx % 5} />
                    <div className="visual-card-thumbnail-overlay" />
                    <div className="visual-card-thumbnail-badge">
                      <HiOutlineSpeakerphone /> {a.category || 'Notice'}
                    </div>
                  </div>

                  <div className="notice-card-body">
                    <div className="notice-card-date-badge">
                      {formatDate(a.createdAt)}
                      {a.createdBy && <> · {a.createdBy.fullName}</>}
                    </div>
                    <div className="notice-card-title">{a.title}</div>
                    <div className="notice-card-desc">{a.description}</div>
                    {regStatus && (
                      <div style={{ marginTop: 'var(--space-xs)' }}>
                        <span className="badge" style={{ background: regStatus.color + '18', color: regStatus.color, fontSize: '0.65rem' }}>
                          {regStatus.label}
                          {a.registrationDeadline && ` · ${formatDate(a.registrationDeadline)}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="notice-card-footer">
                    <div className="notice-card-meta">
                      {a.attachment?.fileName && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <HiOutlinePaperClip /> {a.attachment.fileName}
                        </span>
                      )}
                    </div>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: 'var(--space-xs)' }} onClick={(e) => e.stopPropagation()}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(a)}>
                          <HiOutlinePencil /> Edit
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(a)} style={{ color: 'var(--coral-600)' }}>
                          <HiOutlineTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination currentPage={page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Announcement' : 'Create Announcement'} size="lg">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Title <span className="required">*</span></label>
              <input type="text" className="form-input" placeholder="Announcement title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description <span className="required">*</span></label>
            <textarea className="form-textarea" placeholder="Announcement details..." rows={4} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          {/* Event-related fields */}
          <div className="form-section-label">Event Details (Optional)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Event Name</label>
              <input type="text" className="form-input" placeholder="e.g. Tech Symposium 2026" value={form.eventName}
                onChange={(e) => setForm({ ...form, eventName: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Organizer</label>
              <input type="text" className="form-input" placeholder="Organizing body" value={form.organizer}
                onChange={(e) => setForm({ ...form, organizer: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input type="date" className="form-input" value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Event Time</label>
              <input type="text" className="form-input" placeholder="10:00 AM – 4:00 PM" value={form.eventTime}
                onChange={(e) => setForm({ ...form, eventTime: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Venue</label>
              <input type="text" className="form-input" placeholder="Location" value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Registration Start</label>
              <input type="date" className="form-input" value={form.registrationStart}
                onChange={(e) => setForm({ ...form, registrationStart: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Registration Deadline</label>
              <input type="date" className="form-input" value={form.registrationDeadline}
                onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Attachment</label>
            <div className={`file-upload-area ${file ? 'has-file' : ''}`} onClick={() => document.getElementById('ann-file').click()}>
              <input id="ann-file" type="file" style={{ display: 'none' }} accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files[0])} />
              <div className="file-upload-icon"><HiOutlinePaperClip /></div>
              <div className="file-upload-text">
                {file ? file.name : editing?.attachment?.fileName ? `Current: ${editing.attachment.fileName}` : <><strong>Click to upload</strong> or drag and drop</>}
              </div>
            </div>
          </div>

          {!editing && (
            <div className="notification-modal-option">
              <label className="checkbox-container">
                <input type="checkbox" checked={sendNotification} onChange={(e) => setSendNotification(e.target.checked)} />
                <span className="checkbox-custom" />
                <div className="checkbox-label-content">
                  <div className="checkbox-title">
                    <HiOutlineBell style={{ verticalAlign: 'middle', marginRight: 4, color: 'var(--navy-600)' }} />
                    Broadcast Instant Notification
                  </div>
                  <div className="checkbox-sub">
                    Send real-time alert to all student dashboards & notification bells immediately upon publishing.
                  </div>
                </div>
              </label>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }}></span>}
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={submitting}
      />
    </div>
  );
};

export default AnnouncementsPage;
