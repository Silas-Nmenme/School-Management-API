const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['BSc', 'MSc', 'PhD', 'BEng', 'MEng', 'BBA', 'MBA', 'BA', 'MA', 'LLB', 'LLM', 'MBBS', 'B.Ed', 'M.Ed'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { _id: false });

const departmentSchema = new mongoose.Schema({
  departmentId: {
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
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true
  },
  courses: [courseSchema],
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

// Indexes for faster queries
departmentSchema.index({ name: 1 });
departmentSchema.index({ faculty: 1 });
departmentSchema.index({ isActive: 1 });

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;
