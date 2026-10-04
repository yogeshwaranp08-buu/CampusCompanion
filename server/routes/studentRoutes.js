const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const {
  getStudents,
  getStudentStats,
  exportStudents,
  validateBulkImport,
  bulkImportStudents,
  bulkDeleteStudents
} = require('../controllers/studentController');

// Ensure temp uploads directory exists
const tempDir = path.join(__dirname, '..', 'uploads', 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Multer config for Excel/CSV uploads
const importStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `import-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const importFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.xlsx', '.xls', '.csv'];
  const allowedMimes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/csv'
  ];

  if (allowedExts.includes(ext) || allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel (.xlsx) and CSV (.csv) files are allowed.'), false);
  }
};

const uploadImport = multer({
  storage: importStorage,
  fileFilter: importFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// All routes require admin authentication
router.use(authenticateUser, requireAdmin);

// Student list with filters
router.get('/', getStudents);

// Student statistics
router.get('/stats', getStudentStats);

// Export to Excel
router.get('/export', exportStudents);

// Validate bulk import (upload + preview)
router.post('/bulk-import/validate', uploadImport.single('file'), validateBulkImport);

// Execute bulk import (confirmed data)
router.post('/bulk-import', bulkImportStudents);

// Bulk delete
router.post('/bulk-delete', bulkDeleteStudents);

module.exports = router;
