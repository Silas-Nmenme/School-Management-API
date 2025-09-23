const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Fistname: {
    type: String,
    required: true,
    trim: true
  },
    Lastname: {
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
  age: {
    type: Number,
    required: true,
    min: 0
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
  confirmpassword: {
    type: String,
    required: true,
    minlength: 6
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  token: {
    type: String
  },
  otp: {
    type: String
  },
  otpverified: {
    type: Boolean,
    default: false
  },
  courses: [{
    courseId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    materials: [{
      type: String
    }]
  }],
  grades: [{
    courseId: {
      type: String,
      required: true
    },
    grade: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  recentActivity: [{
    action: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: {
      type: String
    }
  }]
}, {
    timestamps: true,
    versionKey: false
});


const Student = mongoose.model('Student', studentSchema);
module.exports = Student;