import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/dataService';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { EventIllustration, EmptyStateIllustration } from '../components/CampusIllustrations';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash,
  HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineClock, HiOutlineExternalLink,
  HiOutlineArrowLeft, HiOutlineUserGroup, HiOutlineCheckCircle
} from 'react-icons/hi';

const STATUS_COLORS = {
  'Upcoming': { bg: 'var(--navy-100)', color: 'var(--navy-700)', badge: 'badge-blue' },
  'Registration Open': { bg: 'var(--sage-100)', color: 'var(--sage-700)', badge: 'badge-green' },
  'Registration Closing Soon': { bg: 'var(--gold-100)', color: 'var(--gold-700)', badge: 'badge-gold' },
  'Registration Closed': { bg: 'var(--coral-100)', color: 'var(--coral-600)', badge: 'badge-red' },
  'Event Ongoing': { bg: 'var(--lavender-100)', color: 'var(--lavender-700)', badge: 'badge-purple' },
  'Event Ended': { bg: 'var(--bg-tertiary)', color: 'var(--text-muted)', badge: 'badge-gray' },
};

const EventsPage = () => {
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [form, setForm] = useState({
    title: '', description: '', date: '', startTime: '', endTime: '',
    venue: '', organizer: '', registrationLink: '',
    registrationStart: '', registrationDeadline: ''
  });

  // Detail view
  const [viewDetail, setViewDetail] = useState(null);
  const [registering, setRegistering] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await eventService.getAll({ search, filter, page, limit: 12 });
      if (data.success) {
        setEvents(data.events);
        setPagination(data.pagination);
      }
    } catch {
      toast.error('Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleSearch = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => { setSearch(value); setPage(1); }, 400));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', date: '', startTime: '', endTime: '', venue: '', organizer: '', registrationLink: '', registrationStart: '', registrationDeadline: '' });
    setFile(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title, description: item.description,
      date: item.date ? item.date.split('T')[0] : '',
      startTime: item.startTime, endTime: item.endTime,
      venue: item.venue, organizer: item.organizer, registrationLink: item.registrationLink || '',
      registrationStart: item.registrationStart ? item.registrationStart.split('T')[0] : '',
      registrationDeadline: item.registrationDeadline ? item.registrationDeadline.split('T')[0] : ''
    });
    setFile(null);
    setShowModal(true);
  };

  const openDetail = async (ev) => {
    try {
      const { data } = await eventService.getOne(ev._id);
      if (data.success) setViewDetail(data.event);
      else setViewDetail(ev);
    } catch {
      setViewDetail(ev);
    }
  };

  const handleRegister = async () => {
    if (!viewDetail) return;
    setRegistering(true);
    try {
      const { data } = await eventService.register(viewDetail._id);
      toast.success(data.message);
      setViewDetail({ ...viewDetail, isRegistered: true, registrationCount: data.registrationCount });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register.');
    } finally {
      setRegistering(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date || !form.startTime || !form.endTime || !form.venue || !form.organizer) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append('image', file);

      if (editing) {
        await eventService.update(editing._id, formData);
        toast.success('Event updated successfully.');
      } else {
        await eventService.create(formData);
        toast.success('Event created successfully.');
      }
      setShowModal(false);
      fetchEvents();
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
      await eventService.delete(deleteTarget._id);
      toast.success('Event deleted successfully.');
      setDeleteTarget(null);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
  const formatDateLong = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  const getStatusStyle = (status) => STATUS_COLORS[status] || STATUS_COLORS['Upcoming'];

  const canRegister = (ev) => {
    const s = ev.status;
    return (s === 'Registration Open' || s === 'Registration Closing Soon') && !ev.isRegistered && user?.role === 'student';
  };

  const getRegButtonLabel = (ev) => {
    if (ev.isRegistered) return 'Already Registered';
    if (ev.status === 'Event Ended') return 'Event Ended';
    if (ev.status === 'Registration Closed') return 'Registration Closed';
    if (ev.status === 'Event Ongoing') return 'Event Ongoing';
    if (ev.status === 'Upcoming') return 'Registration Not Open';
    return 'Register Now';
  };

  // Detail view
  if (viewDetail) {
    const statusStyle = getStatusStyle(viewDetail.status);
    return (
      <div className="page-animate">
        <button className="btn btn-ghost btn-sm" onClick={() => setViewDetail(null)} style={{ marginBottom: 'var(--space-lg)' }}>
          <HiOutlineArrowLeft /> Back to Events
        </button>

        <div className="event-detail-layout">
          <div className="event-detail-main card">
            {viewDetail.image?.fileUrl && (
              <img src={`/${viewDetail.image.fileUrl}`} alt={viewDetail.title} className="event-detail-image" />
            )}
            <div className="event-detail-content">
              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
                <span className={`badge ${statusStyle.badge}`} style={{ fontSize: '0.75rem' }}>{viewDetail.status}</span>
              </div>
              <h1 className="event-detail-title">{viewDetail.title}</h1>
              <div className="event-detail-description">
                {viewDetail.description.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          </div>

          <div className="event-detail-sidebar">
            <div className="card" style={{ marginBottom: 'var(--space-md)' }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-md)' }}>Event Details</h3>
              <div className="event-detail-info-list">
                <div className="event-detail-info-item">
                  <HiOutlineCalendar />
                  <div>
                    <div className="event-detail-info-label">Date</div>
                    <div className="event-detail-info-value">{formatDateLong(viewDetail.date)}</div>
                  </div>
                </div>
                <div className="event-detail-info-item">
                  <HiOutlineClock />
                  <div>
                    <div className="event-detail-info-label">Time</div>
                    <div className="event-detail-info-value">{viewDetail.startTime} – {viewDetail.endTime}</div>
                  </div>
                </div>
                <div className="event-detail-info-item">
                  <HiOutlineLocationMarker />
                  <div>
                    <div className="event-detail-info-label">Venue</div>
                    <div className="event-detail-info-value">{viewDetail.venue}</div>
                  </div>
                </div>
                <div className="event-detail-info-item">
                  <HiOutlineUserGroup />
                  <div>
                    <div className="event-detail-info-label">Organizer</div>
                    <div className="event-detail-info-value">{viewDetail.organizer}</div>
                  </div>
                </div>
                {viewDetail.registrationCount !== undefined && (
                  <div className="event-detail-info-item">
                    <HiOutlineCheckCircle />
                    <div>
                      <div className="event-detail-info-label">Registrations</div>
                      <div className="event-detail-info-value">{viewDetail.registrationCount} registered</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration section */}
            {viewDetail.registrationStart && (
              <div className="card" style={{ marginBottom: 'var(--space-md)' }}>
                <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-md)' }}>Registration</h3>
                <div className="event-detail-info-list">
                  <div className="event-detail-info-item">
                    <HiOutlineCalendar />
                    <div>
                      <div className="event-detail-info-label">Opens</div>
                      <div className="event-detail-info-value">{formatDateLong(viewDetail.registrationStart)}</div>
                    </div>
                  </div>
                  {viewDetail.registrationDeadline && (
                    <div className="event-detail-info-item">
                      <HiOutlineClock />
                      <div>
                        <div className="event-detail-info-label">Deadline</div>
                        <div className="event-detail-info-value" style={{ color: viewDetail.status === 'Registration Closing Soon' ? 'var(--gold-600)' : undefined }}>
                          {formatDateLong(viewDetail.registrationDeadline)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Registration button */}
            {user?.role === 'student' && (
              <button
                className={`btn ${canRegister(viewDetail) ? 'btn-primary' : 'btn-secondary'} btn-block`}
                disabled={!canRegister(viewDetail) || registering}
                onClick={handleRegister}
                style={{ width: '100%' }}
              >
                {registering && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }} />}
                {viewDetail.isRegistered && <HiOutlineCheckCircle />}
                {getRegButtonLabel(viewDetail)}
              </button>
            )}

            {viewDetail.registrationLink && canRegister(viewDetail) && (
              <a href={viewDetail.registrationLink} target="_blank" rel="noopener noreferrer"
                className="btn btn-teal btn-block" style={{ width: '100%', marginTop: 'var(--space-sm)', textAlign: 'center' }}>
                <HiOutlineExternalLink /> External Registration
              </a>
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
          <h1>Events</h1>
          <p>Discover and explore campus events</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={openCreate}>
            <HiOutlinePlus /> Add New
          </button>
        )}
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <HiOutlineSearch className="search-icon" />
          <input type="text" placeholder="Search events..." onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}>
          <option value="">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : events.length === 0 ? (
        <EmptyState
          icon={HiOutlineCalendar}
          title="No events found"
          message={isAdmin ? 'Create your first event.' : 'No events have been scheduled yet.'}
          showAction={isAdmin}
          actionLabel="Create Event"
          onAction={openCreate}
          customIllustration={<EmptyStateIllustration type="events" />}
        />
      ) : (
        <>
          <div className="content-grid">
            {events.map((ev, idx) => {
              const statusStyle = getStatusStyle(ev.status);
              const isEnded = ev.status === 'Event Ended';
              return (
                <div key={ev._id} className={`content-card visual-content-card card-animate ${isEnded ? 'event-ended-card' : ''}`}
                  onClick={() => openDetail(ev)} style={{ cursor: 'pointer' }}>
                  {ev.image?.fileUrl ? (
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}>
                      <img src={`/${ev.image.fileUrl}`} alt={ev.title} className="content-card-image" style={isEnded ? { filter: 'grayscale(40%) opacity(0.8)' } : {}} />
                      <div style={{ position: 'absolute', top: 'var(--space-sm)', left: 'var(--space-sm)' }}>
                        <span className={`badge ${statusStyle.badge}`}>{ev.status}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="visual-card-thumbnail" style={isEnded ? { filter: 'grayscale(40%) opacity(0.7)' } : {}}>
                      <EventIllustration seed={idx % 5} />
                      <div className="visual-card-thumbnail-overlay" />
                      <div className="visual-card-thumbnail-badge event-badge">
                        <HiOutlineCalendar /> {ev.status}
                      </div>
                    </div>
                  )}
                  <div className="content-card-body">
                    <div className="content-card-title">{ev.title}</div>
                    <div className="content-card-desc">{ev.description}</div>
                    <div className="content-card-meta" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <HiOutlineCalendar /> {formatDate(ev.date)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <HiOutlineClock /> {ev.startTime} – {ev.endTime}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <HiOutlineLocationMarker /> {ev.venue}
                      </span>
                    </div>
                    {ev.registrationCount > 0 && (
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-xs)' }}>
                        <HiOutlineUserGroup style={{ verticalAlign: 'middle', marginRight: 3 }} />
                        {ev.registrationCount} registered
                      </div>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="content-card-actions" onClick={(e) => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(ev)}><HiOutlinePencil /> Edit</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(ev)} style={{ color: 'var(--coral-600)' }}>
                        <HiOutlineTrash />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Pagination currentPage={page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Event' : 'Create Event'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title <span className="required">*</span></label>
            <input type="text" className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" />
          </div>
          <div className="form-group">
            <label className="form-label">Description <span className="required">*</span></label>
            <textarea className="form-textarea" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Event description" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Date <span className="required">*</span></label>
              <input type="date" className="form-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time <span className="required">*</span></label>
              <input type="time" className="form-input" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">End Time <span className="required">*</span></label>
              <input type="time" className="form-input" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Venue <span className="required">*</span></label>
              <input type="text" className="form-input" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Event venue" />
            </div>
            <div className="form-group">
              <label className="form-label">Organizer <span className="required">*</span></label>
              <input type="text" className="form-input" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} placeholder="Organizing body" />
            </div>
          </div>

          <div className="form-section-label">Registration Period (Optional)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Registration Start</label>
              <input type="date" className="form-input" value={form.registrationStart} onChange={(e) => setForm({ ...form, registrationStart: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Registration Deadline</label>
              <input type="date" className="form-input" value={form.registrationDeadline} onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">External Registration Link</label>
            <input type="url" className="form-input" value={form.registrationLink} onChange={(e) => setForm({ ...form, registrationLink: e.target.value })} placeholder="https://" />
          </div>
          <div className="form-group">
            <label className="form-label">Event Image</label>
            <div className={`file-upload-area ${file ? 'has-file' : ''}`} onClick={() => document.getElementById('event-img').click()}>
              <input id="event-img" type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              <div className="file-upload-text">{file ? file.name : 'Click to upload image'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }}></span>}
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Event" message={`Are you sure you want to delete "${deleteTarget?.title}"?`} loading={submitting} />
    </div>
  );
};

export default EventsPage;
