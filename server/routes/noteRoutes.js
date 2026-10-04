const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const { uploadNote, handleUploadError } = require('../middleware/upload');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  downloadNote,
  bulkUploadNotes
} = require('../controllers/noteController');

router.use(authenticateUser);

router.get('/', getNotes);
router.get('/:id', getNote);
router.get('/:id/download', downloadNote); // Both admin and student can download

// Admin only
router.post('/', requireAdmin, uploadNote.single('file'), handleUploadError, createNote);
router.post('/bulk-upload', requireAdmin, uploadNote.array('files', 20), handleUploadError, bulkUploadNotes);
router.put('/:id', requireAdmin, uploadNote.single('file'), handleUploadError, updateNote);
router.delete('/:id', requireAdmin, deleteNote);

module.exports = router;
