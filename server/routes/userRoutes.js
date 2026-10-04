const express = require('express');
const router = express.Router();
const { authenticateUser, requireAdmin } = require('../middleware/auth');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getDashboardStats
} = require('../controllers/userController');

router.use(authenticateUser);

// Dashboard stats - accessible by both roles
router.get('/stats/dashboard', getDashboardStats);

// Admin-only user management
router.get('/', requireAdmin, getUsers);

// Get user - admin or self (enforced in controller)
router.get('/:id', getUser);

// Update user - admin or self (enforced in controller)
router.put('/:id', updateUser);

// Delete user - admin only
router.delete('/:id', requireAdmin, deleteUser);

module.exports = router;
