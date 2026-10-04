const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const { deleteFile } = require('../middleware/upload');

// Helper: Calculate event status based on dates
const getEventStatus = (event) => {
  const now = new Date();
  const eventDate = new Date(event.date);

  // Parse time strings to create full date-time objects
  const parseTime = (dateObj, timeStr) => {
    if (!timeStr) return dateObj;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const dt = new Date(dateObj);
    dt.setHours(hours || 0, minutes || 0, 0, 0);
    return dt;
  };

  const eventStart = parseTime(eventDate, event.startTime);
  const eventEnd = parseTime(eventDate, event.endTime);
  const regStart = event.registrationStart ? new Date(event.registrationStart) : null;
  const regDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;

  if (now > eventEnd) return 'Event Ended';
  if (now >= eventStart && now <= eventEnd) return 'Event Ongoing';
  if (regDeadline && now > regDeadline) return 'Registration Closed';
  if (regDeadline && regStart && now >= regStart && now <= regDeadline) {
    // Check if deadline is within 24 hours
    const hoursLeft = (regDeadline - now) / (1000 * 60 * 60);
    if (hoursLeft <= 24) return 'Registration Closing Soon';
    return 'Registration Open';
  }
  if (regStart && now < regStart) return 'Upcoming';
  // If no registration dates are set, fall back to simple date comparison
  if (now < eventStart) return 'Upcoming';
  return 'Upcoming';
};

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res) => {
  try {
    const { search, filter, page = 1, limit = 12 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter upcoming or past events
    const now = new Date();
    if (filter === 'upcoming') {
      query.date = { $gte: now };
    } else if (filter === 'past') {
      query.date = { $lt: now };
    }

    const total = await Event.countDocuments(query);
    const sortOrder = filter === 'upcoming' ? { date: 1 } : { date: -1 };

    const events = await Event.find(query)
      .populate('createdBy', 'fullName email role')
      .sort(sortOrder)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Add computed status and registration count
    const eventsWithStatus = await Promise.all(events.map(async (event) => {
      const eventObj = event.toObject();
      eventObj.status = getEventStatus(event);
      eventObj.registrationCount = await EventRegistration.countDocuments({ event: event._id });
      return eventObj;
    }));

    res.json({
      success: true,
      events: eventsWithStatus,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch events.' });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'fullName email role');

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const eventObj = event.toObject();
    eventObj.status = getEventStatus(event);
    eventObj.registrationCount = await EventRegistration.countDocuments({ event: event._id });

    // Check if current user is registered
    if (req.user.role === 'student') {
      const existing = await EventRegistration.findOne({ event: event._id, student: req.user._id });
      eventObj.isRegistered = !!existing;
    }

    res.json({ success: true, event: eventObj });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch event.' });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Admin
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, venue, organizer, registrationLink, registrationStart, registrationDeadline } = req.body;

    if (!title || !description || !date || !startTime || !endTime || !venue || !organizer) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    const eventData = {
      title, description, date, startTime, endTime, venue, organizer, registrationLink,
      registrationStart: registrationStart || null,
      registrationDeadline: registrationDeadline || null,
      createdBy: req.user._id
    };

    if (req.file) {
      eventData.image = {
        fileName: req.file.originalname,
        fileUrl: `uploads/events/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      };
    }

    const event = await Event.create(eventData);
    await event.populate('createdBy', 'fullName email role');

    const eventObj = event.toObject();
    eventObj.status = getEventStatus(event);
    eventObj.registrationCount = 0;

    res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      event: eventObj
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ success: false, message: 'Failed to create event.' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Admin
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const updateData = { ...req.body };

    // Handle registration dates
    if (updateData.registrationStart === '') updateData.registrationStart = null;
    if (updateData.registrationDeadline === '') updateData.registrationDeadline = null;

    if (req.file) {
      if (event.image && event.image.fileUrl) {
        deleteFile(event.image.fileUrl);
      }
      updateData.image = {
        fileName: req.file.originalname,
        fileUrl: `uploads/events/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size
      };
    }

    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('createdBy', 'fullName email role');

    const eventObj = event.toObject();
    eventObj.status = getEventStatus(event);
    eventObj.registrationCount = await EventRegistration.countDocuments({ event: event._id });

    res.json({
      success: true,
      message: 'Event updated successfully.',
      event: eventObj
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update event.' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    if (event.image && event.image.fileUrl) {
      deleteFile(event.image.fileUrl);
    }

    // Also delete registrations
    await EventRegistration.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Student
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    // Backend enforcement: check event status
    const status = getEventStatus(event);
    if (status === 'Event Ended') {
      return res.status(400).json({ success: false, message: 'This event has already ended.' });
    }
    if (status === 'Registration Closed') {
      return res.status(400).json({ success: false, message: 'Registration has closed for this event.' });
    }
    if (status === 'Upcoming' && event.registrationStart) {
      return res.status(400).json({ success: false, message: 'Registration has not started yet for this event.' });
    }

    // Check for duplicate registration
    const existing = await EventRegistration.findOne({ event: event._id, student: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already registered for this event.' });
    }

    await EventRegistration.create({
      event: event._id,
      student: req.user._id
    });

    const registrationCount = await EventRegistration.countDocuments({ event: event._id });

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event!',
      registrationCount
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already registered for this event.' });
    }
    console.error('Event registration error:', error);
    res.status(500).json({ success: false, message: 'Failed to register for event.' });
  }
};

// @desc    Check registration status
// @route   GET /api/events/:id/registration-status
// @access  Private
exports.getRegistrationStatus = async (req, res) => {
  try {
    const existing = await EventRegistration.findOne({ event: req.params.id, student: req.user._id });
    res.json({
      success: true,
      isRegistered: !!existing
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to check registration status.' });
  }
};
