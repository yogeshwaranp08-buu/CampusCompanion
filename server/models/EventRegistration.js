const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Unique constraint: one registration per student per event
eventRegistrationSchema.index({ event: 1, student: 1 }, { unique: true });
eventRegistrationSchema.index({ event: 1 });
eventRegistrationSchema.index({ student: 1 });

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
