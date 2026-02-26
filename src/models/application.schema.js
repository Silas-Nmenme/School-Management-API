const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: String,
    trim: true,
    index: true
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
    trim: true,
    index: true
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
    max: 4,
    default: null
  },

  satScore: {
    type: Number,
    min: 400,
    max: 1600,
    default: null
  },

  actScore: {
    type: Number,
    min: 1,
    max: 36,
    default: null
  },

  // 🔥 NEW: Proper references (Production-grade design)

  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
    index: true
  },

  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
    index: true
  },

  // 🔥 Snapshot strings (fast filtering + historical integrity)

  facultyName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  departmentName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  course: {
    type: String,
    required: true,
    trim: true
  },

  essay: {
    type: String,
    maxlength: 2000,
    trim: true
  },

  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Accepted'],
    default: 'Pending',
    index: true
  },

  remarks: {
    type: String,
    trim: true,
    default: null
  },

  reviewedAt: {
    type: Date,
    default: null
  },

  submissionDate: {
    type: Date,
    default: Date.now,
    index: true
  }

}, {
  timestamps: true,
  versionKey: false
});


/* ===============================
   COMPOUND INDEXES (Optimized)
=================================*/

// Fast filtering by faculty + department
applicationSchema.index({ facultyId: 1, departmentId: 1 });

// Admin dashboard filtering
applicationSchema.index({ status: 1, submissionDate: -1 });

// Student lookup optimization
applicationSchema.index({ email: 1, studentId: 1 });


const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;