const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, logout, getMe } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

// Rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: {
    success: false,
    message: 'Too many attempts. Please try again after 15 minutes.'
  }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', authenticateUser, logout);
router.get('/me', authenticateUser, getMe);

module.exports = router;
