const Application = require("../models/application.schema.js");
const Department = require("../models/department.schema.js");
const { getEmailService } = require("../emails/service.js");

const VALID_STATUSES = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Accepted'];

/**
 * Generate unique student ID
 */
const generateStudentId = () => {
    return 'STU' + Date.now() + Math.floor(Math.random() * 1000);
};

/**
 * Submit Application
 */
const submitApplication = async (req, res) => {
    try {
        const {
            studentId,
            firstName,
            lastName,
            email,
            phone,
            address,
            highSchool,
            gpa,
            satScore,
            actScore,
            departmentId,
            course,
            essay
        } = req.body;

        // ===== REQUIRED FIELD VALIDATION =====
        if (!firstName || !lastName || !email || !phone || !highSchool || !course || !departmentId) {
            return res.status(400).json({
                message: "Missing required fields: firstName, lastName, email, phone, highSchool, course, departmentId"
            });
        }

        // ===== DUPLICATE CHECK =====
        const existingApplication = await Application.findOne({ email });
        if (existingApplication) {
            return res.status(400).json({
                message: "An application with this email address already exists"
            });
        }

        // ===== SCORE VALIDATION =====
        if (gpa !== undefined && (gpa < 0 || gpa > 4)) {
            return res.status(400).json({ message: "GPA must be between 0 and 4" });
        }

        if (satScore !== undefined && (satScore < 400 || satScore > 1600)) {
            return res.status(400).json({ message: "SAT score must be between 400 and 1600" });
        }

        if (actScore !== undefined && (actScore < 1 || actScore > 36)) {
            return res.status(400).json({ message: "ACT score must be between 1 and 36" });
        }

        // ===== FIND DEPARTMENT + FACULTY =====
        const department = await Department.findById(departmentId).populate('faculty');

        if (!department) {
            return res.status(400).json({
                message: "Invalid department selected"
            });
        }

        if (!department.faculty) {
            return res.status(400).json({
                message: "Selected department has no associated faculty"
            });
        }

        // ===== VALIDATE COURSE EXISTS =====
        const courseExists = department.courses?.some(
            c => c.name === course && c.isActive !== false
        );

        if (!courseExists) {
            return res.status(400).json({
                message: `Course "${course}" is not available in ${department.name}`
            });
        }

        // ===== EXTRACT IDS + NAMES =====
        const departmentIdValue = department._id;
        const facultyIdValue = department.faculty._id;

        const departmentNameValue = department.name;
        const facultyNameValue = department.faculty.name;

        // ===== GENERATE STUDENT ID =====
        const generatedStudentId = studentId || generateStudentId();

        // ===== CREATE APPLICATION =====
        const newApplication = new Application({
            studentId: generatedStudentId,
            firstName,
            lastName,
            email,
            phone,
            address: address || '',
            highSchool,
            gpa: gpa ?? null,
            satScore: satScore ?? null,
            actScore: actScore ?? null,

            // 🔥 REQUIRED BY NEW SCHEMA
            departmentId: departmentIdValue,
            facultyId: facultyIdValue,

            facultyName: facultyNameValue,
            departmentName: departmentNameValue,

            course,
            essay: essay || '',
            status: 'Pending',
            submissionDate: new Date()
        });

        const savedApplication = await newApplication.save();

        // ===== EMAIL DATA =====
        const applicationEmailData = {
            applicantName: `${firstName} ${lastName}`,
            id: savedApplication._id,
            studentId: savedApplication.studentId,
            status: savedApplication.status,
            submissionDate: savedApplication.submissionDate,
            faculty: savedApplication.facultyName,
            department: savedApplication.departmentName,
            course,
            remarks: ''
        };

        // ===== SEND EMAILS (NON-BLOCKING) =====
        try {
            const emailService = getEmailService();

            emailService
                .sendApplicationNotificationEmail(email, applicationEmailData)
                .catch(err => console.error("Applicant email error:", err.message));

            emailService
                .sendAdminApplicationNotificationEmail(
                    process.env.ADMIN_EMAIL,
                    savedApplication
                )
                .catch(err => console.error("Admin email error:", err.message));

        } catch (emailError) {
            console.error("Email service error:", emailError.message);
        }

        // ===== RESPONSE =====
        res.status(201).json({
            message: "Application submitted successfully",
            applicationId: savedApplication._id,
            studentId: savedApplication.studentId,
            status: savedApplication.status,
            submissionDate: savedApplication.submissionDate
        });

        console.log("Application submitted:", {
            studentId: savedApplication.studentId,
            facultyId: facultyIdValue,
            departmentId: departmentIdValue,
            faculty: facultyNameValue,
            department: departmentNameValue,
            course
        });

    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get Application Status
 */
const getApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({
            studentId: application.studentId,
            status: application.status,
            remarks: application.remarks ?? null,
            submissionDate: application.submissionDate,
            reviewedAt: application.reviewedAt ?? null,
            faculty: application.facultyName,
            department: application.departmentName,
            course: application.course
        });

    } catch (error) {
        console.error("Status fetch error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get Application Details
 */
const getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId)
            .populate('facultyId', 'name facultyId')
            .populate('departmentId', 'name departmentId');

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({ application });

    } catch (error) {
        console.error("Details fetch error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get All Applications (Admin)
 */
const getAllApplications = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        let query = {};
        if (status && VALID_STATUSES.includes(status)) {
            query.status = status;
        }

        const applications = await Application.find(query)
            .sort({ submissionDate: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('facultyId', 'name')
            .populate('departmentId', 'name');

        const totalApplications = await Application.countDocuments(query);

        res.status(200).json({
            totalApplications,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalApplications / limit),
            applications
        });

    } catch (error) {
        console.error("Admin fetch error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get Application by Email
 */
const getApplicationByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const application = await Application.findOne({ email });

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({ application });

    } catch (error) {
        console.error("Email fetch error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    submitApplication,
    getApplicationStatus,
    getApplicationDetails,
    getAllApplications,
    getApplicationByEmail
};