const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: [
      'Computer Science and Engineering',
      'Information Technology',
      'Electronics and Communication Engineering',
      'Electrical and Electronics Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Production Engineering',
      'Other'
    ]
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    enum: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']
  },
  fileName: {
    type: String,
    required: [true, 'File is required']
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

noteSchema.index({ title: 'text', subject: 'text', description: 'text' });
noteSchema.index({ department: 1, semester: 1, year: 1 });
noteSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
