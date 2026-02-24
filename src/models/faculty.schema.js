const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index for faster queries
facultySchema.index({ name: 1 });
facultySchema.index({ isActive: 1 });

const Faculty = mongoose.model('Faculty', facultySchema);
module.exports = Faculty;
