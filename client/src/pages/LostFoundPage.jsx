import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { lostFoundService } from '../services/dataService';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash,
  HiOutlineLocationMarker, HiOutlinePhotograph, HiOutlineCheckCircle,
  HiOutlineLightningBolt, HiOutlineEye, HiOutlineClock
} from 'react-icons/hi';
import { LostFoundIllustration, EmptyStateIllustration } from '../components/CampusIllustrations';

const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Accessories', 'Documents', 'ID Cards', 'Keys', 'Bags', 'Sports', 'Stationery', 'Other'];

const LostFoundPage = () => {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [form, setForm] = useState({
    itemName: '', description: '', category: '', type: '', location: '', date: '', contact: ''
  });

  // Matching
  const [possibleMatches, setPossibleMatches] = useState([]);
  const [showMatches, setShowMatches] = useState(false);
  const [matchItem, setMatchItem] = useState(null);

  // Detail view
  const [viewDetail, setViewDetail] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search, page, limit: 12 };
      if (typeFilter) params.type = typeFilter;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;
      const { data } = await lostFoundService.getAll(params);
      if (data.success) {
        setItems(data.items);
        setPagination(data.pagination);
      }
    } catch {
      toast.error('Failed to load items.');
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, categoryFilter, statusFilter, page]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSearch = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => { setSearch(value); setPage(1); }, 400));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ itemName: '', description: '', category: '', type: '', location: '', date: '', contact: '' });
    setFile(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      itemName: item.itemName, description: item.description, category: item.category,
      type: item.type, location: item.location,
      date: item.date ? item.date.split('T')[0] : '', contact: item.contact
    });
    setFile(null);
    setShowModal(true);
  };

  const canModify = (item) => {
    return isAdmin || (item.createdBy?._id === user?._id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.itemName || !form.description || !form.category || !form.type || !form.location || !form.date || !form.contact) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append('image', file);

      if (editing) {
        await lostFoundService.update(editing._id, formData);
        toast.success('Post updated successfully.');
      } else {
        const { data } = await lostFoundService.create(formData);
        toast.success('Post created successfully.');
        // Show matches if found
        if (data.possibleMatches && data.possibleMatches.length > 0) {
          setPossibleMatches(data.possibleMatches);
          setMatchItem(data.item);
          setShowMatches(true);
        }
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async (item) => {
    try {
      const { data } = await lostFoundService.resolve(item._id);
      toast.success(data.message);
      fetchItems();
      if (viewDetail && viewDetail._id === item._id) {
        setViewDetail(data.item);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    }
  };

  const viewMatches = async (item) => {
    try {
      const { data } = await lostFoundService.getMatches(item._id);
      setPossibleMatches(data.matches || []);
      setMatchItem(item);
      setShowMatches(true);
    } catch {
      toast.error('Failed to find matches.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await lostFoundService.delete(deleteTarget._id);
      toast.success('Post deleted successfully.');
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const timeAgo = (d) => {
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return formatDate(d);
  };

  return (
    <div className="page-animate">
      <div className="page-header">
        <div>
          <h1>Lost & Found</h1>
          <p>Report lost items or help reunite found items with their owners</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <HiOutlinePlus /> Report Item
        </button>
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <HiOutlineSearch className="search-icon" />
          <input type="text" placeholder="Search items, descriptions, locations..." onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
          <option value="">All Types</option>
          <option value="Lost">Lost</option>
          <option value="Found">Found</option>
        </select>
        <select className="filter-select" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={HiOutlineSearch}
          title="No lost & found posts"
          message="No items have been reported yet. Report a lost or found item."
          showAction={true}
          actionLabel="Report Item"
          onAction={openCreate}
          customIllustration={<EmptyStateIllustration type="lostfound" />}
        />
      ) : (
        <>
          <div className="content-grid">
            {items.map((item) => {
              const isResolved = item.status === 'Resolved';
              return (
                <div key={item._id} className={`content-card visual-content-card card-animate ${isResolved ? 'lf-resolved-card' : ''}`}>
                  {item.image?.fileUrl ? (
                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}>
                      <img src={`/${item.image.fileUrl}`} alt={item.itemName} className="content-card-image" style={isResolved ? { filter: 'grayscale(40%) opacity(0.7)' } : {}} />
                      <div style={{ position: 'absolute', top: 'var(--space-sm)', left: 'var(--space-sm)', display: 'flex', gap: 5, zIndex: 2 }}>
                        <span className={`badge ${item.type === 'Lost' ? 'badge-red' : 'badge-green'}`}>{item.type}</span>
                        <span className="badge badge-gray">{item.category}</span>
                        {isResolved && <span className="badge badge-teal">Resolved</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="visual-card-thumbnail" style={isResolved ? { filter: 'grayscale(40%) opacity(0.7)' } : {}}>
                      <LostFoundIllustration category={item.category} type={item.type} />
                      <div className="visual-card-thumbnail-overlay" />
                      <div style={{ position: 'absolute', top: 'var(--space-sm)', left: 'var(--space-sm)', display: 'flex', gap: 5, zIndex: 2 }}>
                        <span className={`badge ${item.type === 'Lost' ? 'badge-red' : 'badge-green'}`}>{item.type}</span>
                        <span className="badge badge-gray">{item.category}</span>
                        {isResolved && <span className="badge badge-teal">Resolved</span>}
                      </div>
                    </div>
                  )}
                  <div className="content-card-body">
                    <div className="content-card-title">{item.itemName}</div>
                    <div className="content-card-desc">{item.description}</div>
                    <div className="content-card-meta" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <HiOutlineLocationMarker /> {item.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <HiOutlineClock /> {timeAgo(item.createdAt)} · {formatDate(item.date)}
                      </span>
                      <span>Contact: {item.contact}</span>
                      {item.createdBy && <span>Posted by {item.createdBy.fullName}</span>}
                    </div>
                  </div>
                  <div className="content-card-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => viewMatches(item)} title="Find possible matches">
                      <HiOutlineLightningBolt /> Matches
                    </button>
                    {canModify(item) && (
                      <>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleResolve(item)}
                          title={isResolved ? 'Mark as active' : 'Mark as resolved'}>
                          <HiOutlineCheckCircle /> {isResolved ? 'Reactivate' : 'Resolve'}
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}><HiOutlinePencil /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(item)} style={{ color: 'var(--coral-600)' }}>
                          <HiOutlineTrash />
                        </button>
                      </>
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
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Post' : 'Report Item'} size="lg">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Item Name <span className="required">*</span></label>
              <input type="text" className="form-input" value={form.itemName} onChange={(e) => setForm({ ...form, itemName: e.target.value })} placeholder="e.g. Blue Backpack" />
            </div>
            <div className="form-group">
              <label className="form-label">Type <span className="required">*</span></label>
              <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="">Select Type</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description <span className="required">*</span></label>
            <textarea className="form-textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the item in detail" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Category <span className="required">*</span></label>
              <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Location <span className="required">*</span></label>
              <input type="text" className="form-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Library, Block A" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Date <span className="required">*</span></label>
              <input type="date" className="form-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Info <span className="required">*</span></label>
              <input type="text" className="form-input" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Phone or email" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Image (optional)</label>
            <div className={`file-upload-area ${file ? 'has-file' : ''}`} onClick={() => document.getElementById('lf-img').click()}>
              <input id="lf-img" type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
              <div className="file-upload-icon"><HiOutlinePhotograph /></div>
              <div className="file-upload-text">{file ? file.name : 'Click to upload item image'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }}></span>}
              {editing ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Possible Matches Modal */}
      <Modal isOpen={showMatches} onClose={() => setShowMatches(false)} title="Possible Matches" size="lg">
        <div>
          {matchItem && (
            <div className="match-source-item">
              <strong>Your {matchItem.type} item:</strong> {matchItem.itemName} ({matchItem.category})
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}> at {matchItem.location}</span>
            </div>
          )}
          {possibleMatches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>
              <p>No possible matches found at this time.</p>
              <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-sm)' }}>
                Check back later as new items are reported.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-md)' }}>
                <HiOutlineLightningBolt style={{ verticalAlign: 'middle', color: 'var(--gold-600)' }} /> The following items may be related. These are <strong>possible matches</strong> — please verify before claiming.
              </p>
              {possibleMatches.map((match) => (
                <div key={match._id} className="match-card">
                  <div className="match-card-header">
                    <span className={`badge ${match.type === 'Lost' ? 'badge-red' : 'badge-green'}`}>{match.type}</span>
                    <span className="badge badge-gray">{match.category}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                      {timeAgo(match.createdAt)}
                    </span>
                  </div>
                  <h4 style={{ fontWeight: 'var(--font-medium)', marginBottom: '4px' }}>{match.itemName}</h4>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '6px' }}>{match.description}</p>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', gap: 'var(--space-md)' }}>
                    <span><HiOutlineLocationMarker style={{ verticalAlign: 'middle' }} /> {match.location}</span>
                    {match.createdBy && <span>By {match.createdBy.fullName}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Post" message={`Are you sure you want to delete "${deleteTarget?.itemName}"?`} loading={submitting} />
    </div>
  );
};

export default LostFoundPage;
