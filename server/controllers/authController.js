const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Set cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// @desc    Register student
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { fullName, collegeId, email, password, department, year, phone } = req.body;

    // Validate required fields
    if (!fullName || !collegeId || !email || !password || !department || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.'
      });
    }

    // Validate student email domain
    if (!email.endsWith('@student.tce.edu')) {
      return res.status(400).json({
        success: false,
        message: 'Only @student.tce.edu email addresses are allowed for registration.'
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Check for existing email
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // Check for existing college ID
    const existingId = await User.findOne({ collegeId: collegeId.toUpperCase() });
    if (existingId) {
      return res.status(400).json({
        success: false,
        message: 'An account with this College ID already exists.'
      });
    }

    // Create student user
    const user = await User.create({
      fullName,
      collegeId: collegeId.toUpperCase(),
      email: email.toLowerCase(),
      passwordHash: password,
      role: 'student',
      department,
      year,
      phone
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please login with your credentials.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `An account with this ${field} already exists.`
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

// @desc    Login user (student or admin)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Generate token and set cookie
    const token = generateToken(user._id);
    res.cookie('token', token, cookieOptions);

    // Return user info (without password)
    res.json({
      success: true,
      message: 'Login successful!',
      user: {
        _id: user._id,
        fullName: user.fullName,
        collegeId: user.collegeId,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0)
    });
    res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Logout failed.'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get user information.'
    });
  }
};
