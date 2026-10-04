import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { noteService } from '../services/dataService';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { NotesIllustration, EmptyStateIllustration } from '../components/CampusIllustrations';
import toast from 'react-hot-toast';
import {
  HiOutlinePlus, HiOutlineSearch, HiOutlinePencil, HiOutlineTrash,
  HiOutlineDocumentText, HiOutlineDownload, HiOutlineUpload,
  HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineDocumentAdd
} from 'react-icons/hi';

const DEPARTMENTS = [
  'Computer Science and Engineering', 'Information Technology',
  'Electronics and Communication Engineering', 'Electrical and Electronics Engineering',
  'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
  'Production Engineering', 'Other'
];
const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const NotesPage = () => {
  const { isAdmin } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [form, setForm] = useState({
    title: '', subject: '', description: '', department: '', semester: '', year: ''
  });

  // Bulk upload
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFiles, setBulkFiles] = useState([]);
  const [bulkForm, setBulkForm] = useState({
    title: '', subject: '', description: '', department: '', semester: '', year: ''
  });
  const [bulkUploading, setBulkUploading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search, page, limit: 12 };
      if (department) params.department = department;
      if (semester) params.semester = semester;
      if (year) params.year = year;
      const { data } = await noteService.getAll(params);
      if (data.success) {
        setNotes(data.notes);
        setPagination(data.pagination);
      }
    } catch {
      toast.error('Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, [search, department, semester, year, page]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleSearch = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => { setSearch(value); setPage(1); }, 400));
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', subject: '', description: '', department: '', semester: '', year: '' });
    setFile(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({ title: item.title, subject: item.subject, description: item.description || '', department: item.department, semester: item.semester, year: item.year });
    setFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.subject || !form.department || !form.semester || !form.year) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!editing && !file) {
      toast.error('Please upload a file.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append('file', file);

      if (editing) {
        await noteService.update(editing._id, formData);
        toast.success('Note updated successfully.');
      } else {
        await noteService.create(formData);
        toast.success('Note uploaded successfully.');
      }
      setShowModal(false);
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Bulk file handling
  const handleBulkFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    const validated = selected.map(f => {
      const ext = f.name.split('.').pop().toLowerCase();
      const isPdf = ext === 'pdf' && f.type === 'application/pdf';
      const isDoc = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'].includes(ext);
      const tooLarge = f.size > 25 * 1024 * 1024;
      const isDangerous = ['exe', 'bat', 'cmd', 'sh', 'js', 'msi', 'dll'].includes(ext);

      let status = 'ready';
      let error = '';
      if (isDangerous) { status = 'invalid'; error = 'Unsupported file type'; }
      else if (!isPdf && !isDoc) { status = 'invalid'; error = 'Not a supported document'; }
      else if (tooLarge) { status = 'invalid'; error = 'File exceeds 25MB limit'; }

      return { file: f, name: f.name, size: f.size, status, error };
    });
    setBulkFiles(validated);
  };

  const removeBulkFile = (index) => {
    setBulkFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleBulkUpload = async () => {
    if (!bulkForm.title || !bulkForm.subject || !bulkForm.department || !bulkForm.semester || !bulkForm.year) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const validFiles = bulkFiles.filter(f => f.status === 'ready');
    if (validFiles.length === 0) {
      toast.error('No valid files to upload.');
      return;
    }
    setBulkUploading(true);
    try {
      const formData = new FormData();
      Object.entries(bulkForm).forEach(([k, v]) => formData.append(k, v));
      validFiles.forEach(f => formData.append('files', f.file));

      const { data } = await noteService.bulkUpload(formData);
      toast.success(data.message);
      setShowBulkModal(false);
      setBulkFiles([]);
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk upload failed.');
    } finally {
      setBulkUploading(false);
    }
  };

  const handleDownload = async (note) => {
    try {
      const response = await noteService.download(note._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', note.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Download started.');
    } catch {
      toast.error('Failed to download file.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await noteService.delete(deleteTarget._id);
      toast.success('Note deleted successfully.');
      setDeleteTarget(null);
      fetchNotes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="page-animate">
      <div className="page-header">
        <div>
          <h1>Notes</h1>
          <p>Access and download academic notes and study materials</p>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-secondary" onClick={() => {
              setShowBulkModal(true);
              setBulkFiles([]);
              setBulkForm({ title: '', subject: '', description: '', department: '', semester: '', year: '' });
            }}>
              <HiOutlineDocumentAdd /> Bulk Upload
            </button>
            <button className="btn btn-primary" onClick={openCreate}>
              <HiOutlinePlus /> Add New
            </button>
          </div>
        )}
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <HiOutlineSearch className="search-icon" />
          <input type="text" placeholder="Search notes..." onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1); }}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="filter-select" value={semester} onChange={(e) => { setSemester(e.target.value); setPage(1); }}>
          <option value="">All Semesters</option>
          {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
        <select className="filter-select" value={year} onChange={(e) => { setYear(e.target.value); setPage(1); }}>
          <option value="">All Years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : notes.length === 0 ? (
        <EmptyState
          icon={HiOutlineDocumentText}
          title="No notes available"
          message={isAdmin ? 'Upload your first study material.' : 'No notes have been uploaded yet.'}
          showAction={isAdmin}
          actionLabel="Upload Note"
          onAction={openCreate}
          customIllustration={<EmptyStateIllustration type="notes" />}
        />
      ) : (
        <>
          <div className="content-grid">
            {notes.map((note, idx) => (
              <div key={note._id} className="content-card visual-content-card card-animate">
                <div className="visual-card-thumbnail notes-thumbnail">
                  <NotesIllustration seed={idx % 6} />
                  <div className="visual-card-thumbnail-overlay" />
                  <div className="visual-card-thumbnail-badge notes-badge">
                    <span className="badge badge-blue">{note.fileType?.split('/').pop()?.toUpperCase() || 'FILE'}</span>
                    <span className="badge badge-gold">Sem {note.semester}</span>
                  </div>
                </div>
                <div className="content-card-body">
                  <div className="content-card-title">{note.title}</div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--navy-700)', marginBottom: '6px' }}>{note.subject}</p>
                  {note.description && <div className="content-card-desc">{note.description}</div>}
                  <div className="content-card-meta" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '3px', marginTop: 'var(--space-sm)' }}>
                    <span>{note.department}</span>
                    <span>{note.year} · {formatDate(note.createdAt)} {note.fileSize ? `· ${formatSize(note.fileSize)}` : ''}</span>
                  </div>
                </div>
                <div className="content-card-actions">
                  <button className="btn btn-primary btn-sm" onClick={() => handleDownload(note)}>
                    <HiOutlineDownload /> Download
                  </button>
                  {isAdmin && (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(note)}><HiOutlinePencil /> Edit</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setDeleteTarget(note)} style={{ color: 'var(--coral-600)' }}>
                        <HiOutlineTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={pagination.pages} onPageChange={setPage} />
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Note' : 'Upload Note'} size="lg">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Title <span className="required">*</span></label>
              <input type="text" className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Note title" />
            </div>
            <div className="form-group">
              <label className="form-label">Subject <span className="required">*</span></label>
              <input type="text" className="form-input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject name" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Department <span className="required">*</span></label>
              <select className="form-select" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                <option value="">Select</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Semester <span className="required">*</span></label>
              <select className="form-select" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}>
                <option value="">Select</option>
                {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year <span className="required">*</span></label>
              <select className="form-select" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>
                <option value="">Select</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">File {!editing && <span className="required">*</span>}</label>
            <div className={`file-upload-area ${file ? 'has-file' : ''}`} onClick={() => document.getElementById('note-file').click()}>
              <input id="note-file" type="file" style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                onChange={(e) => setFile(e.target.files[0])} />
              <div className="file-upload-icon"><HiOutlineUpload /></div>
              <div className="file-upload-text">
                {file ? file.name : editing?.fileName ? `Current: ${editing.fileName}` : <>
                  <strong>Click to upload</strong> (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT - Max 25MB)
                </>}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }}></span>}
              {editing ? 'Update' : 'Upload'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)} title="Bulk Upload Notes" size="lg">
        <div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)', fontSize: 'var(--text-sm)' }}>
            Upload multiple PDF files at once. All files will share the same title, subject, department, semester, and year.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Title <span className="required">*</span></label>
              <input type="text" className="form-input" value={bulkForm.title} onChange={(e) => setBulkForm({ ...bulkForm, title: e.target.value })} placeholder="e.g. Data Structures" />
            </div>
            <div className="form-group">
              <label className="form-label">Subject <span className="required">*</span></label>
              <input type="text" className="form-input" value={bulkForm.subject} onChange={(e) => setBulkForm({ ...bulkForm, subject: e.target.value })} placeholder="Subject name" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" rows={2} value={bulkForm.description} onChange={(e) => setBulkForm({ ...bulkForm, description: e.target.value })} placeholder="Brief description" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Department <span className="required">*</span></label>
              <select className="form-select" value={bulkForm.department} onChange={(e) => setBulkForm({ ...bulkForm, department: e.target.value })}>
                <option value="">Select</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Semester <span className="required">*</span></label>
              <select className="form-select" value={bulkForm.semester} onChange={(e) => setBulkForm({ ...bulkForm, semester: e.target.value })}>
                <option value="">Select</option>
                {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Year <span className="required">*</span></label>
              <select className="form-select" value={bulkForm.year} onChange={(e) => setBulkForm({ ...bulkForm, year: e.target.value })}>
                <option value="">Select</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Select PDF Files <span className="required">*</span></label>
            <div className={`file-upload-area ${bulkFiles.length > 0 ? 'has-file' : ''}`} onClick={() => document.getElementById('bulk-note-files').click()}>
              <input id="bulk-note-files" type="file" style={{ display: 'none' }}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" multiple
                onChange={handleBulkFileSelect} />
              <div className="file-upload-icon"><HiOutlineDocumentAdd /></div>
              <div className="file-upload-text">
                {bulkFiles.length > 0 ? `${bulkFiles.length} file(s) selected` : <><strong>Click to select multiple files</strong> (PDF, DOC, etc. - Max 25MB each)</>}
              </div>
            </div>
          </div>

          {/* File preview list */}
          {bulkFiles.length > 0 && (
            <div className="bulk-file-list">
              {bulkFiles.map((f, i) => (
                <div key={i} className={`bulk-file-item ${f.status === 'invalid' ? 'bulk-file-invalid' : ''}`}>
                  <div className="bulk-file-info">
                    {f.status === 'ready' ? (
                      <HiOutlineCheckCircle className="bulk-file-status-icon" style={{ color: 'var(--sage-600)' }} />
                    ) : (
                      <HiOutlineXCircle className="bulk-file-status-icon" style={{ color: 'var(--coral-600)' }} />
                    )}
                    <span className="bulk-file-name">{f.name}</span>
                    <span className="bulk-file-size">{formatSize(f.size)}</span>
                  </div>
                  <div className="bulk-file-actions">
                    {f.error && <span className="bulk-file-error">{f.error}</span>}
                    <span className={`badge ${f.status === 'ready' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.65rem' }}>
                      {f.status === 'ready' ? 'Ready' : 'Invalid'}
                    </span>
                    <button className="btn btn-ghost btn-sm btn-icon" onClick={() => removeBulkFile(i)} title="Remove">
                      <HiOutlineTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-secondary" onClick={() => setShowBulkModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleBulkUpload}
              disabled={bulkUploading || bulkFiles.filter(f => f.status === 'ready').length === 0}>
              {bulkUploading && <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderTopColor: '#fff' }} />}
              Upload {bulkFiles.filter(f => f.status === 'ready').length} Files
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Note" message={`Are you sure you want to delete "${deleteTarget?.title}"?`} loading={submitting} />
    </div>
  );
};

export default NotesPage;
