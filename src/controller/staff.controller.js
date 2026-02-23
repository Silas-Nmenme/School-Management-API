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
const listStudentsForStaff = async (req, res) => {
  try {
    const staffId = req.student?.id;
    if (!staffId) return res.status(401).json({ message: 'Unauthorized' });

    const students = await Student.find().select('studentId Firstname Lastname email age phone createdAt');
    res.status(200).json({ total: students.length, students });
  } catch (error) {
    console.error('Error listing students for staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Staff-limited update to a student record (only certain fields)
const updateStudentRecord = async (req, res) => {
  try {
    const staffId = req.student?.id;
    if (!staffId) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    const allowed = ['phone', 'age'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    if (Object.keys(updates).length === 0) return res.status(400).json({ message: 'No updatable fields provided' });

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Apply updates
    if (updates.phone !== undefined) student.phone = updates.phone;
    if (updates.age !== undefined) student.age = updates.age;
    await student.save();

    // Send a templated audit notification to admin (non-blocking)
    try {
      const emailService = getEmailService();
        if (typeof emailService.sendStudentRecordUpdateNotification === 'function') {
        const payload = {
          studentId: student.studentId || student._id,
          studentName: `${student.Firstname || student.FirstName || student.firstName || ''} ${student.Lastname || student.LastName || student.lastName || ''}`.trim(),
          updatedFields: Object.keys(updates).map(k => `${k}: ${updates[k]}`).join(', '),
          staffName: req.student?.email || 'Staff',
          staffEmail: req.student?.email || '',
          updateTime: new Date().toLocaleString()
        };
        emailService.sendStudentRecordUpdateNotification(process.env.ADMIN_EMAIL || 'admin@example.com', payload).catch(() => {});
          // also notify the student about the change (non-blocking)
          if (student.email && typeof emailService.sendStudentUpdateNotificationToStudent === 'function') {
            const studentPayload = Object.assign({}, payload, { firstname: student.Firstname || student.firstName || '' });
            emailService.sendStudentUpdateNotificationToStudent(student.email, studentPayload).catch(() => {});
          }
      }
    } catch (e) { /* ignore */ }

    res.status(200).json({ message: 'Student record updated', student: { id: student._id, phone: student.phone, age: student.age } });
  } catch (error) {
    console.error('Error updating student record by staff:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// List team members (other staff) - limited info
const listTeamMembers = async (req, res) => {
  try {
    const staffId = req.student?.id;
    if (!staffId) return res.status(401).json({ message: 'Unauthorized' });

    const staff = await Staff.find().select('firstName lastName email role department isActive');
    res.status(200).json({ total: staff.length, staff });
  } catch (error) {
    console.error('Error listing team members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Staff changes their own password (requires current password)
const changeOwnPassword = async (req, res) => {
  try {
    const staffId = req.student?.id;
    if (!staffId) return res.status(401).json({ message: 'Unauthorized' });

    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Current password and new password (min 6 chars) are required' });
    }

    const staff = await Staff.findById(staffId);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const matches = await bcrypt.compare(currentPassword, staff.password);
    if (!matches) return res.status(401).json({ message: 'Current password incorrect' });

    const hashed = await bcrypt.hash(newPassword, 10);
    staff.password = hashed;
    if (staff.mustChangePassword) staff.mustChangePassword = false;
    staff.lastLogin = new Date();
    await staff.save();

    // send confirmation email (non-blocking)
    try {
      const emailService = getEmailService();
      if (typeof emailService.sendStaffPasswordChangeConfirmation === 'function') {
        emailService.sendStaffPasswordChangeConfirmation(staff.email, {
          firstname: staff.firstName,
          lastname: staff.lastName,
          changedAt: new Date().toLocaleString(),
          changedBy: `${staff.firstName} ${staff.lastName}`
        }).catch(() => {});
      }
    } catch (e) { /* ignore */ }

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing own password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { staffLogin, getStaffDashboard, listStudentsForStaff, updateStudentRecord, listTeamMembers, changeOwnPassword };
