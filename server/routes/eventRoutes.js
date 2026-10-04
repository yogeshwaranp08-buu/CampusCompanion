const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin, requireStudent } = require('../middleware/auth');
const { uploadImage, handleUploadError } = require('../middleware/upload');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getRegistrationStatus
} = require('../controllers/eventController');

router.use(authenticateUser);

router.get('/', getEvents);
router.get('/:id', getEvent);

// Event registration (students only)
router.post('/:id/register', requireStudent, registerForEvent);
router.get('/:id/registration-status', getRegistrationStatus);

// Admin only
router.post('/', requireAdmin, uploadImage('events').single('image'), handleUploadError, createEvent);
router.put('/:id', requireAdmin, uploadImage('events').single('image'), handleUploadError, updateEvent);
router.delete('/:id', requireAdmin, deleteEvent);

module.exports = router;
