const Student = require("../models/student.schema.js");
const Course = require("../models/course.schema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const uuid = require("uuid").v4;
const token = uuid(); // Generate a unique token for the student
const { parseUserAgent } = require("../utils/userAgentParser");
const { getEmailService } = require("../emails/service.js");

const generateStudentId = () => {
    return 'STU' + Date.now() + Math.floor(Math.random() * 1000);
};

const registerStudent = async (req, res) => {
       const { Firstname, Lastname, email, age, phone, password, confirmpassword } = req.body;
    // Validate required fields
    if (!Firstname || !Lastname || !email || !age || !phone || !password || !confirmpassword) {
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
        Firstname,
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
            Firstname: newStudent.Firstname,
            Lastname: newStudent.Lastname,
            email: newStudent.email,
            age: newStudent.age,
            phone: newStudent.phone,
            registrationDate: newStudent.createdAt
        };

        res.status(201).json({ message: "Student registered successfully", registrationDetails });
        console.log("New student registered:", registrationDetails);

        // Send welcome email using template (non-blocking)
        const studentData = {
            Fistname: newStudent.Firstname,
            Lastname: newStudent.Lastname,
            studentId: newStudent.studentId,
            email: newStudent.email,
            age: newStudent.age,
            phone: newStudent.phone,
            registrationDate: new Date(newStudent.createdAt).toLocaleDateString()
        };
        
        try {
            const emailService = getEmailService();
            emailService.sendWelcomeEmail(studentData, password).catch(emailError => {
                console.error("Failed to send welcome email:", emailError.message);
                // Don't fail the registration if email fails
            });
        } catch (emailInitError) {
            console.error("Email service not available:", emailInitError.message);
        }

        return newStudent;
};

const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find if student exists
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const payload = {
            email: student.email,
            id: student._id,
        }

        // Generate a new token
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION } // Token expiration time
        );

        // Capture login details
        const forwardedIps = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',').map(ip => ip.trim()) : [];
        const clientIp = forwardedIps.length > 0 ? forwardedIps[0] : req.ip || req.connection.remoteAddress || 'Unknown';

        const parsedUA = parseUserAgent(req.headers['user-agent']);

        const loginData = {
            email: student.email,
            loginTime: new Date().toLocaleString(),
            ip: clientIp,
            location: req.headers['x-forwarded-for'] || req.ip || 'Unknown', // Full forwarded IPs for location
            deviceInfo: `${parsedUA.os} ${parsedUA.deviceModel} (${parsedUA.deviceType})`,
            browserInfo: `${parsedUA.browser} ${parsedUA.browserVersion}`,
            os: parsedUA.os,
            deviceModel: parsedUA.deviceModel,
            browser: parsedUA.browser,
            browserVersion: parsedUA.browserVersion,
            deviceType: parsedUA.deviceType,
            sessionId: req.sessionID || 'N/A',
            authMethod: 'Password',
            isSuspicious: false, // Set based on your logic
            securityStatus: 'Verified', // Add security status
            riskLevel: 'Low' // Add risk level based on logic
        };

        // Send login alert email using template (non-blocking)
        try {
            const emailService = getEmailService();
            emailService.sendLoginAlert(loginData).then(result => {
                if (result.success) {
                    console.log(`✓ Login alert email sent to: ${loginData.email}`);
                } else {
                    console.error(`✗ Failed to send login alert email to ${loginData.email}:`, result.message);
                }
            }).catch(emailError => {
                console.error("✗ Error sending login alert email:", emailError.message || emailError);
            });
        } catch (emailInitError) {
            console.error("✗ Email service not available:", emailInitError.message);
        }

        const studentPayload = {
            studentId: student.studentId,
            Firstname: student.Firstname,
            Lastname: student.Lastname,
            email: student.email,
            age: student.age,
            phone: student.phone
        };

        return res.status(200).json({ message: "Login successful", token, student: studentPayload });
    } catch (error) {
        console.error("Error logging in student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const makeAdmin = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        student.isAdmin = true; // Assuming you have an isAdmin field in your student schema
        await student.save();

        // Send admin promotion email (non-blocking)
        try {
            const emailService = getEmailService();
            emailService.sendAdminPromotionEmail(student).then(result => {
                if (result.success) {
                    console.log(`✓ Admin promotion email sent to: ${student.email}`);
                } else {
                    console.error(`✗ Failed to send admin promotion email to ${student.email}:`, result.error);
                }
            }).catch(emailError => {
                console.error("✗ Error sending admin promotion email:", emailError.message || emailError);
            });
        } catch (emailInitError) {
            console.error("✗ Email service not available:", emailInitError.message);
        }

        return res.status(200).json({ message: "Student promoted to admin successfully", student });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Validate required fields
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Find the student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Generate a 6 digit otp with math.random()
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        student.otp = otp; // Assuming you have an otp field in your student schema
        await student.save();

        // Send OTP email (non-blocking)
        try {
            const emailService = getEmailService();
            emailService.sendOtpEmail(student, otp).then(result => {
                if (result.success) {
                    console.log(`✓ OTP email sent to: ${student.email}`);
                } else {
                    console.error(`✗ Failed to send OTP email to ${student.email}:`, result.error);
                }
            }).catch(emailError => {
                console.error("✗ Error sending OTP email:", emailError.message || emailError);
            });
        } catch (emailInitError) {
            console.error("✗ Email service not available:", emailInitError.message);
        }

        return res.status(200).json({ message: "OTP sent to your email", otp });
    }
    catch (error) {
        console.error("Error in forget password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const verifyOtp = async (req, res) => {
    const {otp} = req.body;
    try{
        const student = await Student.findOne({
            otp: otp
        });
        if (!student) {
            return res.status(404).json({ message: "Invalid OTP" });
        }
        student.otpverified = true; // Assuming you have an otpverified field in your student schema
        await student.save();

        // OTP is valid, proceed with password reset
        return res.status(200).json({ message: "OTP verified successfully", studentId: student._id });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const resetPassword = async (req, res) => {
    const { confirmedPassword, newPassword } = req.body;
    const { studentId } = req.params;
    console.log(studentId)
    // Validate required fields
    if (!studentId || !newPassword) {
        return res.status(400).json({ message: "Student ID and new password are required" });
    }
    if (newPassword !== confirmedPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        if (student.otpverified !== true) {
            return res.status(400).json({ message: "OTP not verified" });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        student.password = hashedPassword;
        student.otpverified = false; // Reset OTP verification status
        await student.save();

        // Send password reset confirmation email (non-blocking)
        try {
            const emailService = getEmailService();
            emailService.sendPasswordResetEmail(student).then(result => {
                if (result.success) {
                    console.log(`✓ Password reset email sent to: ${student.email}`);
                } else {
                    console.error(`✗ Failed to send password reset email to ${student.email}:`, result.error);
                }
            }).catch(emailError => {
                console.error("✗ Error sending password reset email:", emailError.message || emailError);
            });
        } catch (emailInitError) {
            console.error("Email service not available:", emailInitError.message);
        }

        return res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const logoutStudent = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find the student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Optionally, clear the token field if you store it in the DB
        student.token = null;
        await student.save();

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out student:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getStudentCount = async (req, res) => {
    try {
        const count = await Student.countDocuments();
        return res.status(200).json({ totalStudents: count });
    } catch (error) {
        console.error("Error getting student count:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// New methods for student dashboard
const getProfile = async (req, res) => {
    try {
        const studentId = req.student.id; // Assuming JWT middleware sets req.student
        const student = await Student.findById(studentId).select('Firstname Lastname email age phone studentId');
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json({ profile: student });
    } catch (error) {
        console.error("Error getting profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const studentId = req.student.id;
        const { Firstname, Lastname, age, phone } = req.body;
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        if (Firstname) student.Firstname = Firstname;
        if (Lastname) student.Lastname = Lastname;
        if (age) student.age = age;
        if (phone) student.phone = phone;
        await student.save();

        // Send profile update confirmation email (non-blocking)
        try {
            const emailService = getEmailService();
            emailService.sendProfileUpdateEmail(student).catch(emailError => {
                console.error("Failed to send profile update email:", emailError.message);
                // Don't fail the profile update if email fails
            });
        } catch (emailInitError) {
            console.error("Email service not available:", emailInitError.message);
        }

        return res.status(200).json({ message: "Profile updated successfully", profile: student });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getCourses = async (req, res) => {
    try {
        const studentId = req.student.id;
        const student = await Student.findById(studentId).select('courses');
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json({ courses: student.courses });
    } catch (error) {
        console.error("Error getting courses:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getGrades = async (req, res) => {
    try {
        const studentId = req.student.id;
        const student = await Student.findById(studentId).select('grades');
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json({ grades: student.grades });
    } catch (error) {
        console.error("Error getting grades:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getRecentActivity = async (req, res) => {
    try {
        const studentId = req.student.id;
        const student = await Student.findById(studentId).select('recentActivity');
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res.status(200).json({ recentActivity: student.recentActivity });
    } catch (error) {
        console.error("Error getting recent activity:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const registerForCourse = async (req, res) => {
    try {
        const studentId = req.student.id;
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Find the course
        let course;
        if (/^[0-9a-fA-F]{24}$/.test(courseId)) {
            course = await Course.findById(courseId).populate('instructor');
        } else {
            course = await Course.findOne({ courseId: courseId }).populate('instructor');
        }
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (!course.isActive) {
            return res.status(400).json({ message: "Course is not active" });
        }

        // Check if student is already enrolled
        if (course.students.includes(studentId)) {
            return res.status(400).json({ message: "Student is already enrolled in this course" });
        }

        // Check if course is full
        if (course.students.length >= course.maxStudents) {
            return res.status(400).json({ message: "Course is full" });
        }

        // Check if student already has this course in their courses array
        const alreadyEnrolled = student.courses.some(c => c.courseId === course.courseId);
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "Student is already enrolled in this course" });
        }

        // Enroll student
        course.students.push(studentId);
        student.courses.push({
            _id: course._id,
            courseId: course.courseId,
            name: course.name,
            description: course.description,
            materials: []
        });

        // Add to recent activity
        student.recentActivity.push({
            action: `Registered for course: ${course.name}`,
            timestamp: new Date(),
            details: `Course ID: ${course.courseId}`
        });

        // Save both
        await course.save();
        await student.save();

        // Send course registration confirmation email (non-blocking)
        try {
            const emailService = getEmailService();
            emailService.sendCourseRegistrationEmail(student, course).then(result => {
                if (result.success) {
                    console.log(`✓ Course registration email sent to: ${student.email}`);
                } else {
                    console.error(`✗ Failed to send course registration email to ${student.email}:`, result.error);
                }
            }).catch(emailError => {
                console.error("✗ Error sending course registration email:", emailError.message || emailError);
            });
        } catch (emailInitError) {
            console.error("✗ Email service not available:", emailInitError.message);
        }

        return res.status(200).json({ message: "Successfully registered for the course" });
    } catch (error) {
        console.error("Error registering for course:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const unregisterForCourse = async (req, res) => {
    try {
        const studentId = req.student.id;
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Find the course
        let course;
        if (/^[0-9a-fA-F]{24}$/.test(courseId)) {
            course = await Course.findById(courseId).populate('instructor');
        } else {
            course = await Course.findOne({ courseId: courseId }).populate('instructor');
        }
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Check if student is enrolled
        if (!course.students.includes(studentId)) {
            return res.status(400).json({ message: "Student is not enrolled in this course" });
        }

        // Check if student has this course in their courses array
        const courseIndex = student.courses.findIndex(c => c.courseId === course.courseId);
        if (courseIndex === -1) {
            return res.status(400).json({ message: "Student is not enrolled in this course" });
        }

        // Unenroll student
        course.students.pull(studentId);
        student.courses.splice(courseIndex, 1);

        // Add to recent activity
        student.recentActivity.push({
            action: `Unregistered from course: ${course.name}`,
            timestamp: new Date(),
            details: `Course ID: ${course.courseId}`
        });

        // Save both
        await course.save();
        await student.save();

        // Send course unregistration confirmation email (non-blocking)
        try {
            const emailService = getEmailService();
            emailService.sendCourseUnregistrationEmail(student, course).catch(emailError => {
                console.error("Failed to send course unregistration email:", emailError.message);
                // Don't fail the unregistration if email fails
            });
        } catch (emailInitError) {
            console.error("Email service not available:", emailInitError.message);
        }

        return res.status(200).json({ message: "Successfully unregistered from the course" });
    } catch (error) {
        console.error("Error unregistering for course:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const registerForExams = async (req, res) => {
    try {
        const studentId = req.student.id;
        const { courseIds } = req.body;

        if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
            return res.status(400).json({ message: "Course IDs are required and must be an array" });
        }

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const registeredExams = [];
        const errors = [];

        for (const courseId of courseIds) {
            // Find the course (handle both MongoDB _id and courseId formats)
            let course;
            if (/^[0-9a-fA-F]{24}$/.test(courseId)) {
                course = await Course.findById(courseId);
            } else {
                course = await Course.findOne({ courseId: courseId });
            }
            if (!course) {
                errors.push(`Course with ID ${courseId} not found`);
                continue;
            }

            // Check if student is enrolled in this course
            const isEnrolled = student.courses.some(c => c._id.toString() === course._id.toString() || c.courseId === course.courseId);
            if (!isEnrolled) {
                errors.push(`Student is not enrolled in course: ${course.name}`);
                continue;
            }

            // Check if already registered for exam
            const alreadyRegistered = student.exams.some(e => e.courseId === course.courseId);
            if (alreadyRegistered) {
                errors.push(`Already registered for exam in course: ${course.name}`);
                continue;
            }

            // Register for exam
            student.exams.push({
                courseId: course.courseId,
                name: course.name,
                description: course.description,
                materials: [] // Can be updated later if needed
            });

            registeredExams.push(course.name);
        }

        if (registeredExams.length === 0) {
            return res.status(400).json({ message: "No valid courses to register for exams", errors });
        }

        // Add to recent activity
        student.recentActivity.push({
            action: `Registered for exams: ${registeredExams.join(', ')}`,
            timestamp: new Date(),
            details: `Registered for ${registeredExams.length} exam(s)`
        });

        // Save student
        await student.save();

        return res.status(200).json({
            message: `Successfully registered for exams in ${registeredExams.length} course(s)`,
            registeredCourses: registeredExams,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error("Error registering for exams:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const clearExamRegistrations = async (req, res) => {
    try {
        const studentId = req.student.id;
        const { courseIds } = req.body;

        if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
            return res.status(400).json({ message: "Course IDs are required and must be an array" });
        }

        // Find the student
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const clearedExams = [];
        const errors = [];

        for (const courseId of courseIds) {
            // Find the exam registration
            const examIndex = student.exams.findIndex(e => e.courseId === courseId);
            
            if (examIndex === -1) {
                errors.push(`Student is not registered for exam in course ID: ${courseId}`);
                continue;
            }

            // Get exam details before removing
            const exam = student.exams[examIndex];
            
            // Remove from exams
            student.exams.splice(examIndex, 1);

            // Add to recent activity
            student.recentActivity.push({
                action: `Cleared exam registration: ${exam.name}`,
                timestamp: new Date(),
                details: `Course ID: ${courseId}`
            });

            clearedExams.push(exam.name);
        }

        if (clearedExams.length === 0) {
            return res.status(400).json({ message: "No valid exams to clear", errors });
        }

        // Save student
        await student.save();

        return res.status(200).json({
            message: `Successfully cleared exam registrations for ${clearedExams.length} course(s)`,
            clearedExams: clearedExams,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error("Error clearing exam registrations:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getLibraryResources = async (req, res) => {
    try {
        // Dummy library resources
        const resources = [
            {
                id: 1,
                title: "Introduction to Computer Science",
                type: "Book",
                author: "John Doe",
                available: true,
                link: "https://example.com/book1"
            },
            {
                id: 2,
                title: "Mathematics for Beginners",
                type: "E-book",
                author: "Jane Smith",
                available: true,
                link: "https://example.com/ebook1"
            },
            {
                id: 3,
                title: "History of Science",
                type: "Video",
                author: "Dr. Alan",
                available: false,
                link: "https://example.com/video1"
            }
        ];
        return res.status(200).json({ resources });
    } catch (error) {
        console.error("Error getting library resources:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const Support = require("../models/support.schema.js");

const submitSupportRequest = async (req, res) => {
    try {
        const studentId = req.student.id;
        const { studentName, studentEmail, subject, category, message } = req.body;

        if (!studentName || !studentEmail || !subject || !category || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create new support request
        const newSupport = new Support({
            studentId,
            studentName,
            studentEmail,
            subject,
            category,
            message
        });

        await newSupport.save();

        // Send email
        const supportData = {
            studentName,
            studentEmail,
            subject,
            message,
            category
        };
        
        try {
            const emailService = getEmailService();
            emailService.sendSupportRequest(supportData).catch(emailError => {
                console.error("Failed to send support email:", emailError);
            });
        } catch (emailInitError) {
            console.error("Email service not available:", emailInitError.message);
        }

        return res.status(201).json({ message: "Support request submitted successfully" });
    } catch (error) {
        console.error("Error submitting support request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    registerStudent,
    loginStudent,
    makeAdmin,
    forgetPassword,
    verifyOtp,
    resetPassword,
    logoutStudent,
    getStudentCount,
    getProfile,
    updateProfile,
    getCourses,
    getGrades,
    getRecentActivity,
    registerForCourse,
    unregisterForCourse,
    registerForExams,
    clearExamRegistrations,
    getLibraryResources,
    submitSupportRequest
};
