const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Announcement description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  // New fields for enhanced announcements
  category: {
    type: String,
    enum: ['Academic', 'Exam', 'Event', 'Placement', 'Workshop', 'General'],
    default: 'General'
  },
  eventName: {
    type: String,
    trim: true,
    maxlength: [200, 'Event name cannot exceed 200 characters']
  },
  registrationStart: {
    type: Date,
    default: null
  },
  registrationDeadline: {
    type: Date,
    default: null
  },
  eventDate: {
    type: Date,
    default: null
  },
  eventTime: {
    type: String,
    trim: true
  },
  venue: {
    type: String,
    trim: true
  },
  organizer: {
    type: String,
    trim: true
  },
  attachment: {
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

announcementSchema.index({ title: 'text', description: 'text' });
announcementSchema.index({ createdAt: -1 });
announcementSchema.index({ category: 1 });
announcementSchema.index({ registrationDeadline: 1 });

module.exports = mongoose.model('Announcement', announcementSchema);
