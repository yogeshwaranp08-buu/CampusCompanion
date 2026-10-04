const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { uploadImage, handleUploadError } = require('../middleware/upload');
const {
  getLostFoundItems,
  getLostFoundItem,
  createLostFoundItem,
  updateLostFoundItem,
  deleteLostFoundItem,
  resolveItem,
  getMatches
} = require('../controllers/lostFoundController');

router.use(authenticateUser);

router.get('/', getLostFoundItems);
router.get('/:id', getLostFoundItem);
router.get('/:id/matches', getMatches);

// Both admin and student can create
router.post('/', uploadImage('lostfound').single('image'), handleUploadError, createLostFoundItem);

// Owner or admin can update/delete (enforced in controller)
router.put('/:id', uploadImage('lostfound').single('image'), handleUploadError, updateLostFoundItem);
router.put('/:id/resolve', resolveItem);
router.delete('/:id', deleteLostFoundItem);

module.exports = router;
