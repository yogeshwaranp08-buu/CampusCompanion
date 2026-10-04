const Announcement = require('../models/Announcement');
const { deleteFile } = require('../middleware/upload');
const { notifyAllStudents } = require('./notificationController');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private
exports.getAnnouncements = async (req, res) => {
  try {
    const { search, category, sort = 'newest', page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    // Determine sort order
    let sortOrder = { createdAt: -1 }; // default: newest first
    switch (sort) {
      case 'oldest':
        sortOrder = { createdAt: 1 };
        break;
      case 'deadline_soonest':
        sortOrder = { registrationDeadline: 1, createdAt: -1 };
        break;
      case 'deadline_latest':
        sortOrder = { registrationDeadline: -1, createdAt: -1 };
        break;
      case 'event_soonest':
        sortOrder = { eventDate: 1, createdAt: -1 };
        break;
      case 'event_latest':
        sortOrder = { eventDate: -1, createdAt: -1 };
        break;
      default:
        sortOrder = { createdAt: -1 };
    }

    const total = await Announcement.countDocuments(query);
    const announcements = await Announcement.find(query)
      .populate('createdBy', 'fullName email role')
      .sort(sortOrder)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      announcements,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch announcements.' });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'fullName email role');

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    res.json({ success: true, announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch announcement.' });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Admin
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description, category, eventName, registrationStart, registrationDeadline, eventDate, eventTime, venue, organizer } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const announcementData = {
      title,
      description,
      category: category || 'General',
      eventName: eventName || undefined,
      registrationStart: registrationStart || undefined,
      registrationDeadline: registrationDeadline || undefined,
      eventDate: eventDate || undefined,
      eventTime: eventTime || undefined,
      venue: venue || undefined,
      organizer: organizer || undefined,
      createdBy: req.user._id
    };

    if (req.file) {
      announcementData.attachment = {
        fileName: req.file.originalname,
        fileUrl: `uploads/announcements/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      };
    }

    const announcement = await Announcement.create(announcementData);
    await announcement.populate('createdBy', 'fullName email role');

    // Notify all students asynchronously
    notifyAllStudents(announcement, req.user);

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully.',
      announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ success: false, message: 'Failed to create announcement.' });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Admin
exports.updateAnnouncement = async (req, res) => {
  try {
    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    const { title, description, category, eventName, registrationStart, registrationDeadline, eventDate, eventTime, venue, organizer } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (eventName !== undefined) updateData.eventName = eventName;
    if (registrationStart !== undefined) updateData.registrationStart = registrationStart || null;
    if (registrationDeadline !== undefined) updateData.registrationDeadline = registrationDeadline || null;
    if (eventDate !== undefined) updateData.eventDate = eventDate || null;
    if (eventTime !== undefined) updateData.eventTime = eventTime;
    if (venue !== undefined) updateData.venue = venue;
    if (organizer !== undefined) updateData.organizer = organizer;

    if (req.file) {
      // Delete old file if exists
      if (announcement.attachment && announcement.attachment.fileUrl) {
        deleteFile(announcement.attachment.fileUrl);
      }
      updateData.attachment = {
        fileName: req.file.originalname,
        fileUrl: `uploads/announcements/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      };
    }

    announcement = await Announcement.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'fullName email role');

    res.json({
      success: true,
      message: 'Announcement updated successfully.',
      announcement
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update announcement.' });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Admin
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found.' });
    }

    // Delete associated file
    if (announcement.attachment && announcement.attachment.fileUrl) {
      deleteFile(announcement.attachment.fileUrl);
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Announcement deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete announcement.' });
  }
};
