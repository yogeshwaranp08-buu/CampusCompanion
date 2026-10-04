const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true
  },
  organizer: {
    type: String,
    required: [true, 'Organizer is required'],
    trim: true
  },
  registrationLink: {
    type: String,
    trim: true
  },
  // New registration lifecycle fields
  registrationStart: {
    type: Date,
    default: null
  },
  registrationDeadline: {
    type: Date,
    default: null
  },
  image: {
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

eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ date: -1 });
eventSchema.index({ createdAt: -1 });
eventSchema.index({ registrationDeadline: 1 });

module.exports = mongoose.model('Event', eventSchema);
