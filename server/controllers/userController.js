const User = require('../models/User');

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Admin
exports.getUsers = async (req, res) => {
  try {
    const { search, department, year, role, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { collegeId: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) query.department = department;
    if (year) query.year = year;
    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin or self
exports.getUser = async (req, res) => {
  try {
    // Students can only view their own profile
    if (req.user.role === 'student' && req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user.' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Admin or self
exports.updateUser = async (req, res) => {
  try {
    // Students can only update their own profile
    if (req.user.role === 'student' && req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only update your own profile.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Fields students cannot change
    const protectedFields = ['role', 'collegeId', 'email', 'passwordHash'];
    const updateData = {};

    // Allow fullName, department, year, phone updates
    const allowedFields = ['fullName', 'department', 'year', 'phone'];
    
    // Admin can update more fields
    if (req.user.role === 'admin') {
      allowedFields.push('department', 'year');
    }

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete user.' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/users/stats/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const User = require('../models/User');
    const Announcement = require('../models/Announcement');
    const Event = require('../models/Event');
    const Note = require('../models/Note');
    const LostFound = require('../models/LostFound');

    const [students, announcements, events, notes, lostFound] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Announcement.countDocuments(),
      Event.countDocuments(),
      Note.countDocuments(),
      LostFound.countDocuments()
    ]);

    const [recentAnnouncements, upcomingEvents, recentNotes, recentLostFound] = await Promise.all([
      Announcement.find().populate('createdBy', 'fullName').sort({ createdAt: -1 }).limit(5),
      Event.find({ date: { $gte: new Date() } }).sort({ date: 1 }).limit(5),
      Note.find().populate('uploadedBy', 'fullName').sort({ createdAt: -1 }).limit(5),
      LostFound.find().populate('createdBy', 'fullName').sort({ createdAt: -1 }).limit(5)
    ]);

    // Enhanced department and year stats for admin
    let departmentStats = {};
    let yearStats = {};
    if (req.user.role === 'admin') {
      const [deptCounts, yearCounts] = await Promise.all([
        User.aggregate([
          { $match: { role: 'student' } },
          { $group: { _id: '$department', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]),
        User.aggregate([
          { $match: { role: 'student' } },
          { $group: { _id: '$year', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ])
      ]);
      deptCounts.forEach(d => { departmentStats[d._id || 'Unspecified'] = d.count; });
      yearCounts.forEach(y => { yearStats[y._id || 'Unspecified'] = y.count; });
    }

    res.json({
      success: true,
      stats: {
        students,
        announcements,
        events,
        notes,
        lostFound,
        departmentStats,
        yearStats
      },
      recent: {
        announcements: recentAnnouncements,
        events: upcomingEvents,
        notes: recentNotes,
        lostFound: recentLostFound
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' });
  }
};
