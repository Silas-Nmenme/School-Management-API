const Staff = require('../models/staff.schema.js');
const Student = require('../models/student.schema.js');
const Course = require('../models/course.schema.js');
const Application = require('../models/application.schema.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getEmailService } = require('../emails/service.js');

const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const staff = await Staff.findOne({ email });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const isValid = await bcrypt.compare(password, staff.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: staff._id, email: staff.email, role: staff.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

    // Update lastLogin timestamp (don't clear mustChangePassword here — handled on password change)
    try { staff.lastLogin = new Date(); await staff.save(); } catch (e) { /* ignore */ }

    res.status(200).json({
      message: 'Login successful',
      token,
      staff: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        role: staff.role,
        mustChangePassword: !!staff.mustChangePassword
      }
    });
  } catch (error) {
    console.error('Staff login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getStaffDashboard = async (req, res) => {
  try {
    const staffId = req.student?.id;
    if (!staffId) return res.status(401).json({ message: 'Unauthorized' });

    const staff = await Staff.findById(staffId).select('-password');
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const totalStudents = await Student.countDocuments();
    const activeCourses = await Course.countDocuments({ isActive: true });
    const pendingApplications = await Application.countDocuments({ status: 'Pending' });

    const responsibilities = [
      'Manage and support student activities',
      'Maintain accurate records and documentation',
      'Collaborate with other team members',
      'Follow system protocols and procedures',
      'Ensure data privacy and security'
    ];

    res.status(200).json({
      staff: {
        id: staff._id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        role: staff.role,
        department: staff.department,
        lastLogin: staff.lastLogin
      },
      metrics: {
        totalStudents,
        activeCourses,
        pendingApplications
      },
      responsibilities
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { staffLogin, getStaffDashboard };
