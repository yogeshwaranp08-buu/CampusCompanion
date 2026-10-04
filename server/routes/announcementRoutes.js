const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const { uploadGeneral, handleUploadError } = require('../middleware/upload');
const {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');

// All routes require authentication
router.use(authenticateUser);

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);

// Admin only routes
router.post('/', requireAdmin, uploadGeneral('announcements').single('attachment'), handleUploadError, createAnnouncement);
router.put('/:id', requireAdmin, uploadGeneral('announcements').single('attachment'), handleUploadError, updateAnnouncement);
router.delete('/:id', requireAdmin, deleteAnnouncement);

module.exports = router;
