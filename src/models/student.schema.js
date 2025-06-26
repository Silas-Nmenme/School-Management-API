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
  }
}, {
    timestamps: true,
    versionKey: false
});


const Student = mongoose.model('Student', studentSchema);
module.exports = Student;