const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [200, 'Item name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Electronics', 'Books', 'Clothing', 'Accessories', 'Documents', 'ID Cards', 'Keys', 'Bags', 'Sports', 'Stationery', 'Other']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['Lost', 'Found']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true
  },
  // New fields
  status: {
    type: String,
    enum: ['Active', 'Resolved'],
    default: 'Active'
  },
  resolvedAt: {
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

lostFoundSchema.index({ itemName: 'text', description: 'text', location: 'text' });
lostFoundSchema.index({ type: 1, category: 1 });
lostFoundSchema.index({ createdAt: -1 });
lostFoundSchema.index({ createdBy: 1 });
lostFoundSchema.index({ status: 1 });
lostFoundSchema.index({ location: 1 });

module.exports = mongoose.model('LostFound', lostFoundSchema);
