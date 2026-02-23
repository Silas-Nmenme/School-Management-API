const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['teacher', 'administrator', 'staff']
  },
  department: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  mustChangePassword: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

const Staff = mongoose.model('Staff', staffSchema);
module.exports = Staff;
