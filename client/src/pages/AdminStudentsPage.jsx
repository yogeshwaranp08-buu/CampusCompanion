import { useState, useEffect, useCallback } from 'react';
import { studentService, userService } from '../services/dataService';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import {
  HiOutlineSearch, HiOutlineTrash, HiOutlineUsers, HiOutlineEye,
  HiOutlineDownload, HiOutlineUpload, HiOutlineCheckCircle,
  HiOutlineXCircle, HiOutlineDocumentAdd, HiOutlineChevronDown
} from 'react-icons/hi';
import { EmptyStateIllustration } from '../components/CampusIllustrations';

const DEPARTMENTS = [
  'Computer Science and Engineering', 'Information Technology',
  'Electronics and Communication Engineering', 'Electrical and Electronics Engineering',
  'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
  'Production Engineering', 'Other'
];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'];

const AdminStudentsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Bulk delete
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  // Export
  const [exporting, setExporting] = useState(false);

  // Bulk import
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState(null);
  const [importing, setImporting] = useState(false);
  const [validating, setValidating] = useState(false);

  // Stats
  const [stats, setStats] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search, page, limit: 20 };
      if (department) params.department = department;
      if (year) params.year = year;
      const { data } = await studentService.getAll(params);
      if (data.success) {
        setUsers(data.students);
        setPagination(data.pagination);
      }
    } catch {
      toast.error('Failed to load students.');
    } finally {
      setLoading(false);
    }
  }, [search, department, year, page]);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await studentService.getStats();
      if (data.success) setStats(data.stats);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleSearch = (value) => {
    if (searchTimeout) clearTimeout(searchTimeout);
    setSearchTimeout(setTimeout(() => { setSearch(value); setPage(1); }, 400));
  };

  // Selection handlers
  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map(u => u._id)));
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setSelectAll(users.length > 0 && users.every(u => selectedIds.has(u._id)));
  }, [selectedIds, users]);

  // Single delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      await userService.delete(deleteTarget._id);
      toast.success('Student account deleted.');
      setDeleteTarget(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete.');
    } finally {
      setSubmitting(false);
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setSubmitting(true);
    try {
      const { data } = await studentService.bulkDelete({ studentIds: Array.from(selectedIds) });
      toast.success(data.message);
      setSelectedIds(new Set());
      setSelectAll(false);
      setShowBulkDelete(false);
      fetchUsers();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk delete failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Export
  const handleExport = async () => {
    setExporting(true);
    try {
      const params = {};
      if (department) params.department = department;
      if (year) params.year = year;
      const response = await studentService.export(params);
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      // Build filename
      let filename = 'students';
      if (department) {
        const abbr = department.replace(/ and /g, ' & ').split(' ').map(w => w[0]).join('').toUpperCase();
        filename += `_${abbr}`;
      }
      if (year) {
        const yearNum = year.replace(/[^0-9]/g, '');
        filename += `_year${yearNum}`;
      }
      if (!department && !year) filename += '_all';
      filename += '.xlsx';

      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Export downloaded successfully.');
    } catch (err) {
      toast.error('Failed to export students.');
    } finally {
      setExporting(false);
    }
  };

  // Bulk import - validate
  const handleImportValidate = async () => {
    if (!importFile) return toast.error('Please select a file.');
    setValidating(true);
    try {
      const formData = new FormData();
      formData.append('file', importFile);
      const { data } = await studentService.validateImport(formData);
      if (data.success) {
        setImportPreview(data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to validate file.');
    } finally {
      setValidating(false);
    }
  };

  // Bulk import - confirm
  const handleImportConfirm = async () => {
    if (!importPreview) return;
    const validRows = importPreview.rows.filter(r => r.valid).map(r => r.data);
    if (validRows.length === 0) return toast.error('No valid rows to import.');
    setImporting(true);
    try {
      const { data } = await studentService.bulkImport({ students: validRows });
      toast.success(data.message);
      setShowImportModal(false);
      setImportFile(null);
      setImportPreview(null);
      fetchUsers();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Import failed.');
    } finally {
      setImporting(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const getDeptAbbr = (dept) => {
    if (!dept) return '—';
    return dept.replace(/ and /g, ' & ').split(' ').map(w => w[0]).join('');
  };

  return (
    <div className="page-animate">
      <div className="page-header">
        <div>
          <h1>Student Management</h1>
          <p>Manage registered student accounts · {pagination.total || 0} students</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => { setShowImportModal(true); setImportFile(null); setImportPreview(null); }}>
            <HiOutlineUpload /> Bulk Import
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleExport} disabled={exporting}>
            {exporting && <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderTopColor: '#fff' }} />}
            <HiOutlineDownload /> Export Students
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {stats && (
        <div className="student-stats-bar">
          <div className="student-stat-chip">
            <span className="student-stat-value">{stats.totalStudents}</span>
            <span className="student-stat-label">Total</span>
          </div>
          {Object.entries(stats.departments).slice(0, 6).map(([dept, count]) => (
            <div key={dept} className="student-stat-chip">
              <span className="student-stat-value">{count}</span>
              <span className="student-stat-label">{getDeptAbbr(dept)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="search-filter-bar">
        <div className="search-box">
          <HiOutlineSearch className="search-icon" />
          <input type="text" placeholder="Search by name, email, or ID..." onChange={(e) => handleSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1); }}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="filter-select" value={year} onChange={(e) => { setYear(e.target.value); setPage(1); }}>
          <option value="">All Years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="bulk-action-bar">
          <span className="bulk-action-count">{selectedIds.size} student{selectedIds.size > 1 ? 's' : ''} selected</span>
          <button className="btn btn-danger btn-sm" onClick={() => setShowBulkDelete(true)}>
            <HiOutlineTrash /> Bulk Delete
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedIds(new Set()); setSelectAll(false); }}>
            Clear Selection
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton type="table" count={10} />
      ) : users.length === 0 ? (
        <EmptyState
          icon={HiOutlineUsers}
          title="No students found"
          message="No student accounts match your search criteria."
          customIllustration={<EmptyStateIllustration />}
        />
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>
                    <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} className="table-checkbox" />
                  </th>
                  <th>College ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className={selectedIds.has(u._id) ? 'row-selected' : ''}>
                    <td>
                      <input type="checkbox" checked={selectedIds.has(u._id)} onChange={() => toggleSelect(u._id)} className="table-checkbox" />
                    </td>
                    <td style={{ fontWeight: 'var(--font-medium)' }}>{u.collegeId}</td>
                    <td>{u.fullName}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>{u.email}</td>
                    <td>
                      <span className="badge badge-blue" style={{ fontSize: '0.625rem' }}>
                        {getDeptAbbr(u.department)}
                      </span>
                    </td>
                    <td>{u.year}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{u.phone || '—'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{formatDate(u.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setViewStudent(u)} title="View details">
                          <HiOutlineEye />
                        </button>
                        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setDeleteTarget(u)}
                          title="Delete account" style={{ color: 'var(--coral-600)' }}>
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: 'var(--space-md)', borderTop: '1px solid var(--border-light)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            Showing {users.length} of {pagination.total} students
          </div>
        </div>
      )}

      <Pagination currentPage={page} totalPages={pagination.pages} onPageChange={setPage} />

      {/* View Student Details */}
      {viewStudent && (
        <div className="modal-overlay" onClick={() => setViewStudent(null)}>
          <div className="modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Student Details</h2>
              <button className="modal-close" onClick={() => setViewStudent(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="profile-details" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="profile-field">
                  <div className="profile-field-label">Name</div>
                  <div className="profile-field-value">{viewStudent.fullName}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">College ID</div>
                  <div className="profile-field-value">{viewStudent.collegeId}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Email</div>
                  <div className="profile-field-value" style={{ fontSize: 'var(--text-sm)', wordBreak: 'break-all' }}>{viewStudent.email}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Department</div>
                  <div className="profile-field-value" style={{ fontSize: 'var(--text-sm)' }}>{viewStudent.department}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Year</div>
                  <div className="profile-field-value">{viewStudent.year}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Phone</div>
                  <div className="profile-field-value">{viewStudent.phone || '—'}</div>
                </div>
                <div className="profile-field">
                  <div className="profile-field-label">Joined</div>
                  <div className="profile-field-value">{formatDate(viewStudent.createdAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      <Modal isOpen={showImportModal} onClose={() => { setShowImportModal(false); setImportPreview(null); setImportFile(null); }}
        title="Bulk Import Students" size="lg">
        {!importPreview ? (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              Upload an Excel (.xlsx) or CSV file with student records. The file should contain columns:
              <strong> College ID, Name, Email, Department, Year, Phone</strong>
            </p>
            <div className="import-info-box">
              <strong>Password Policy:</strong> Imported students will receive a temporary password in the format:
              <code>CollegeID@Last4DigitsOfPhone</code> (e.g., <code>23IT001@3210</code>).
              Students should change their password after first login.
            </div>
            <div className={`file-upload-area ${importFile ? 'has-file' : ''}`}
              onClick={() => document.getElementById('import-file').click()}>
              <input id="import-file" type="file" style={{ display: 'none' }}
                accept=".xlsx,.xls,.csv"
                onChange={(e) => { setImportFile(e.target.files[0]); setImportPreview(null); }} />
              <div className="file-upload-icon"><HiOutlineDocumentAdd /></div>
              <div className="file-upload-text">
                {importFile ? (
                  <><strong>{importFile.name}</strong> ({(importFile.size / 1024).toFixed(1)} KB)</>
                ) : (
                  <><strong>Click to upload</strong> Excel (.xlsx) or CSV file</>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <button className="btn btn-secondary" onClick={() => setShowImportModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleImportValidate} disabled={!importFile || validating}>
                {validating && <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderTopColor: '#fff' }} />}
                Validate & Preview
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="import-summary-bar">
              <div className="import-summary-item import-summary-total">
                <HiOutlineUsers /> {importPreview.totalRows} Total Rows
              </div>
              <div className="import-summary-item import-summary-valid">
                <HiOutlineCheckCircle /> {importPreview.validCount} Valid
              </div>
              <div className="import-summary-item import-summary-invalid">
                <HiOutlineXCircle /> {importPreview.invalidCount} Invalid
              </div>
            </div>

            <div className="data-table-wrapper" style={{ maxHeight: 400, overflowY: 'auto', marginTop: 'var(--space-md)' }}>
              <table className="data-table" style={{ fontSize: 'var(--text-xs)' }}>
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>College ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Year</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {importPreview.rows.map((row) => (
                    <tr key={row.row} className={row.valid ? '' : 'row-invalid'}>
                      <td>{row.row}</td>
                      <td>{row.data.collegeId}</td>
                      <td>{row.data.fullName}</td>
                      <td style={{ wordBreak: 'break-all' }}>{row.data.email}</td>
                      <td>
                        <span className="badge badge-blue" style={{ fontSize: '0.6rem' }}>
                          {getDeptAbbr(row.data.department)}
                        </span>
                      </td>
                      <td>{row.data.year}</td>
                      <td>
                        {row.valid ? (
                          <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                            <HiOutlineCheckCircle /> Valid
                          </span>
                        ) : (
                          <span className="badge badge-red" style={{ fontSize: '0.65rem' }} title={row.errors.join(', ')}>
                            <HiOutlineXCircle /> {row.errors[0]}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-lg)' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => { setImportPreview(null); setImportFile(null); }}>
                ← Upload Different File
              </button>
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <button className="btn btn-secondary" onClick={() => { setShowImportModal(false); setImportPreview(null); }}>Cancel</button>
                <button className="btn btn-primary" onClick={handleImportConfirm}
                  disabled={importing || importPreview.validCount === 0}>
                  {importing && <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, borderTopColor: '#fff' }} />}
                  Import {importPreview.validCount} Students
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Single Delete Confirmation */}
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Delete Student Account" message={`Are you sure you want to delete ${deleteTarget?.fullName}'s account? This action cannot be undone.`}
        loading={submitting} />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog isOpen={showBulkDelete} onClose={() => setShowBulkDelete(false)} onConfirm={handleBulkDelete}
        title="Bulk Delete Students"
        message={`You are about to delete ${selectedIds.size} student record${selectedIds.size > 1 ? 's' : ''}. This action cannot be undone.`}
        confirmText={`Delete ${selectedIds.size} Students`}
        loading={submitting} />
    </div>
  );
};

export default AdminStudentsPage;
