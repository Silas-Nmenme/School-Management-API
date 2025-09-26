const Student = require("../models/student.schema.js");
const Staff = require("../models/staff.schema.js");
const Admin = require("../models/admin.schema.js");
const Course = require("../models/course.schema.js");
const Settings = require("../models/settings.schema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const uuid = require("uuid").v4;
const token = uuid(); // Generate a unique token for the student
const EmailService = require("../templates/email-service");
const emailService = new EmailService();

const generateStudentId = () => {
    return 'STU' + Date.now() + Math.floor(Math.random() * 1000);
};

const addStudent = async (req, res) => {
    const { Fistname, Lastname, email, age, phone, password, confirmpassword } = req.body;
    // Validate required fields
    if (!Fistname || !Lastname || !email || !age || !phone || !password || !confirmpassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
       const parsedAge = Number(age);
    if (isNaN(parsedAge) || parsedAge <= 0) {
        return res.status(400).json({ message: 'Age must be a positive number' });
    }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        // Check if the student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: "Student already exists" });
        }

        // Validate password match
        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const studentId = generateStudentId(); // Generate a unique student ID

        // Create a new student
         const newStudent = new Student({
        studentId,
        Fistname,
        Lastname,
        email,
        age: parsedAge,
        phone,
        password: hashedPassword,
        confirmpassword: hashedPassword,
        token: token
    });


        // Save the student to the database
        await newStudent.save();

        //Prepare registration details to return (excluding password)
        const registrationDetails = {
            studentId: newStudent.studentId,
            Fistname: newStudent.Fistname,
            Lastname: newStudent.Lastname,
            email: newStudent.email,
            age: newStudent.age,
            phone: newStudent.phone
        };

        res.status(201).json({ message: "Student registered successfully", registrationDetails });
        console.log("New student registered:", registrationDetails);

        // Send welcome email (non-blocking)
        emailService.sendWelcomeEmail(newStudent).catch(emailError => {
            console.error("Failed to send welcome email:", emailError.message);
            // Don't fail the registration if email fails
        });

        return newStudent;
};


//Edit a student
const editStudent = async (req, res) => {
    const { studentId } = req.params;
    const { Fistname, Lastname, email, age, phone } = req.body || {};
    const id = req.student.id;
    try {
        const admin = await Student.findById(id);
        if (admin.isAdmin !== true) {
            return res.status(403).json({ message: "Only admins can edit student" });
        }
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        // Update student details
        student.Fistname = Fistname || student.Fistname;
        student.Lastname = Lastname || student.Lastname;
        student.email = email || student.email;
        student.age = age || student.age;
        student.phone = phone || student.phone;
        await student.save();

        // Send student update notification email
        emailService.sendWelcomeEmail(student).catch(emailError => {
            console.error("Failed to send student update notification email:", emailError.message);
        });

        return res.status(200).json({ message: "Student updated successfully" });
    }
    catch (error) {
        console.error("Error editing student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteStudent = async (req, res) => {
    const  {studentId } = req.params;
    const id = req.student.id;
    try {
        const student = await Student.findById(id);
        if (student.isAdmin !== true) {
            return res.status(403).json({ message: "Only admin can delete student" });
        }
        const deletedStudent = await Student.findByIdAndDelete(studentId);
        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Send account deletion email (non-blocking)
        emailService.sendAccountDeletionEmail(deletedStudent, {
            method: 'Admin Deletion',
            requestedBy: req.user?.email || 'Admin'
        }).catch(emailError => {
            console.error("Failed to send account deletion email:", emailError.message);
            // Don't fail the deletion if email fails
        });

        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all students
const getAllStudents = async (_req, res) => {
    try {
        const students = await Student.find();
        return res.status(200).json({ students});
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Staff Management Functions
const addStaff = async (req, res) => {
    const { firstName, lastName, email, phone, password, role, department, salary } = req.body;
    if (!firstName || !lastName || !email || !phone || !password || !role || !department) {
        return res.status(400).json({ message: "All required fields must be provided" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
        return res.status(400).json({ message: "Staff member already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newStaff = new Staff({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role,
        department,
        salary
    });
    await newStaff.save();

    // Send staff welcome email
    emailService.sendStaffWelcomeEmail({
        Fistname: newStaff.firstName,
        Lastname: newStaff.lastName,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        department: newStaff.department,
        studentId: newStaff._id
    }, password).catch(emailError => {
        console.error("Failed to send staff welcome email:", emailError.message);
    });

    res.status(201).json({ message: "Staff member added successfully", staffId: newStaff._id });
};

const editStaff = async (req, res) => {
    const { staffId } = req.params;
    const updates = req.body;
    try {
        const staff = await Staff.findByIdAndUpdate(staffId, updates, { new: true });
        if (!staff) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        // Send staff update notification email
        emailService.sendStaffWelcomeEmail({
            Fistname: staff.firstName,
            Lastname: staff.lastName,
            email: staff.email,
            phone: staff.phone,
            role: staff.role,
            department: staff.department,
            studentId: staff._id
        }, 'Updated credentials').catch(emailError => {
            console.error("Failed to send staff update notification email:", emailError.message);
        });

        res.status(200).json({ message: "Staff member updated successfully", staff });
    } catch (error) {
        console.error("Error editing staff:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteStaff = async (req, res) => {
    const { staffId } = req.params;
    try {
        const deletedStaff = await Staff.findByIdAndDelete(staffId);
        if (!deletedStaff) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        // Send account deletion email (non-blocking)
        emailService.sendAccountDeletionEmail({
            Fistname: deletedStaff.firstName,
            Lastname: deletedStaff.lastName,
            email: deletedStaff.email,
            age: null, // Staff doesn't have age
            phone: deletedStaff.phone,
            studentId: deletedStaff._id
        }, {
            method: 'Admin Deletion',
            requestedBy: req.user?.email || 'Admin'
        }).catch(emailError => {
            console.error("Failed to send staff account deletion email:", emailError.message);
            // Don't fail the deletion if email fails
        });

        res.status(200).json({ message: "Staff member deleted successfully" });
    } catch (error) {
        console.error("Error deleting staff:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find();
        res.status(200).json({ staff });
    } catch (error) {
        console.error("Error fetching staff:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Course Management Functions
const addCourse = async (req, res) => {
    const { courseId, name, description, instructor, instructorModel, maxStudents, duration, startTime, endTime, days } = req.body;
    if (
        !courseId || !name || !instructor || !instructorModel || !maxStudents || !duration ||
        !startTime || !endTime || !days || !Array.isArray(days) || days.length === 0
    ) {
        return res.status(400).json({
            message: "All required fields must be provided, including instructor, instructorModel, startTime, endTime, and days."
        });
    }
    const existingCourse = await Course.findOne({ courseId });
    if (existingCourse) {
        return res.status(400).json({ message: "Course already exists" });
    }
    const newCourse = new Course({
        courseId,
        name,
        description,
        instructor,
        instructorModel,
        maxStudents,
        duration,
        startTime,
        endTime,
        days
    });
    await newCourse.save();

    res.status(201).json({
        message: "Course added successfully",
        course: {
            courseId: newCourse.courseId,
            name: newCourse.name,
            description: newCourse.description,
            instructor: newCourse.instructor,
            instructorModel: newCourse.instructorModel,
            maxStudents: newCourse.maxStudents,
            duration: newCourse.duration,
            startTime: newCourse.startTime,
            endTime: newCourse.endTime,
            days: newCourse.days
        }
    });
};

const editCourse = async (req, res) => {
    const { courseId } = req.params;
    const updates = req.body;
    try {
        const course = await Course.findByIdAndUpdate(courseId, updates, { new: true });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Send course update notification email to instructor
        emailService.sendCourseUpdateEmail(course).catch(emailError => {
            console.error("Failed to send course update notification email:", emailError.message);
        });

        res.status(200).json({ message: "Course updated successfully", course });
    } catch (error) {
        console.error("Error editing course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Send course deletion notification email to instructor
        emailService.sendCourseDeletionEmail(deletedCourse).catch(emailError => {
            console.error("Failed to send course deletion notification email:", emailError.message);
        });

        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate({
            path: 'instructor',
            select: 'firstName lastName email'
        });
        const formattedCourses = courses.map(course => ({
            _id: course._id,
            courseId: course.courseId,
            name: course.name,
            description: course.description,
            instructor: course.instructor,
            instructorModel: course.instructorModel,
            maxStudents: course.maxStudents,
            duration: course.duration,
            startTime: course.startTime,
            endTime: course.endTime,
            days: course.days
        }));
        res.status(200).json({ courses: formattedCourses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Reports Functions
const generateStudentReport = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const studentsByAge = await Student.aggregate([
            { $group: { _id: "$age", count: { $sum: 1 } } }
        ]);
        const recentRegistrations = await Student.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json({
            totalStudents,
            studentsByAge,
            recentRegistrations
        });
    } catch (error) {
        console.error("Error generating student report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const generateCourseAnalytics = async (req, res) => {
    try {
        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ isActive: true });
        const coursesWithEnrollment = await Course.aggregate([
            { $project: { name: 1, studentCount: { $size: "$students" } } }
        ]);
        res.status(200).json({
            totalCourses,
            activeCourses,
            coursesWithEnrollment
        });
    } catch (error) {
        console.error("Error generating course analytics:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Settings Functions
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
            await settings.save();
        }
        res.status(200).json({ settings });
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateSettings = async (req, res) => {
    const updates = req.body;
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }
        Object.assign(settings, updates);
        await settings.save();

        // Send settings update notification email
        emailService.sendSettingsUpdateEmail(settings, req.user?.email || 'Admin').catch(emailError => {
            console.error("Failed to send settings update notification email:", emailError.message);
        });

        res.status(200).json({ message: "Settings updated successfully", settings });
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Dashboard Overview
const getDashboardOverview = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const activeCourses = await Course.countDocuments({ isActive: true });
        const staffMembers = await Staff.countDocuments();
        const systemUptime = 98; // This would typically be calculated from server metrics
        res.status(200).json({
            totalStudents,
            activeCourses,
            staffMembers,
            systemUptime
        });
    } catch (error) {
        console.error("Error fetching dashboard overview:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Admin Authentication Functions
const adminRegister = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newAdmin = new Admin({
        name,
        email,
        password: hashedPassword,
        role
    });
    await newAdmin.save();

    // Send admin promotion email
    emailService.sendAdminPromotionEmail(newAdmin, 'System Administrator').catch(emailError => {
        console.error("Failed to send admin promotion email:", emailError.message);
    });

    // Send admin registration notification email
    emailService.sendAdminRegistrationEmail(newAdmin, 'System Administrator').catch(emailError => {
        console.error("Failed to send admin registration notification email:", emailError.message);
    });

    res.status(201).json({ message: "Admin registered successfully", adminId: newAdmin._id });
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: admin._id, email: admin.email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send login alert email
    emailService.sendLoginAlert({
        email: admin.email,
        ip: req.ip || 'Unknown',
        location: 'Unknown',
        deviceInfo: req.get('User-Agent') || 'Unknown Device',
        browserInfo: 'Unknown Browser',
        sessionId: token,
        isSuspicious: false,
        authMethod: 'Password'
    }).catch(emailError => {
        console.error("Failed to send login alert email:", emailError.message);
    });

    res.status(200).json({ message: "Login successful", token, admin: { id: admin._id, email: admin.email, name: admin.name } });
};

module.exports = {
    addStudent,
    editStudent,
    deleteStudent,
    getAllStudents,
    addStaff,
    editStaff,
    deleteStaff,
    getAllStaff,
    addCourse,
    editCourse,
    deleteCourse,
    getAllCourses,
    generateStudentReport,
    generateCourseAnalytics,
    getSettings,
    updateSettings,
    getDashboardOverview,
    adminRegister,
    adminLogin
};
