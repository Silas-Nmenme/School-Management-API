const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  schoolName: {
    type: String,
    required: true,
    default: 'SchoolMS'
  },
  schoolEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  schoolPhone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  systemPreferences: {
    allowStudentRegistration: {
      type: Boolean,
      default: true
    },
    requireEmailVerification: {
      type: Boolean,
      default: true
    },
    maxStudentsPerCourse: {
      type: Number,
      default: 50
    },
    sessionTimeout: {
      type: Number, // in minutes
      default: 30
    }
  },
  notificationSettings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;
