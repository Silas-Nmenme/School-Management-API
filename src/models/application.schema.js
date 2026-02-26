const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: String,
    trim: true
  },
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
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  highSchool: {
    type: String,
    required: true,
    trim: true
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4
  },
  satScore: {
    type: Number,
    min: 400,
    max: 1600
  },
  actScore: {
    type: Number,
    min: 1,
    max: 36
  },
  // Store faculty and department as strings for easier querying
  facultyName: {
    type: String,
    trim: true
  },
  departmentName: {
    type: String,
    trim: true
  },
  course: {
    type: String,
    required: true
  },
  essay: {
    type: String,
    maxlength: 2000,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Accepted'],
    default: 'Pending'
  },
  remarks: {
    type: String,
    trim: true
  },
  reviewedAt: {
    type: Date
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index for faster queries on commonly searched fields
applicationSchema.index({ email: 1 });
applicationSchema.index({ studentId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ facultyName: 1 });
applicationSchema.index({ departmentName: 1 });
applicationSchema.index({ submissionDate: -1 });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
