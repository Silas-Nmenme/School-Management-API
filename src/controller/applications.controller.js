const Application = require("../models/application.schema.js");
const Department = require("../models/department.schema.js");
const { getEmailService } = require("../emails/service.js");

// Valid application statuses aligned with admin controller
const VALID_STATUSES = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Accepted'];

/**
 * Generate a unique student ID
 * Format: STU{timestamp}{random3digits}
 */
const generateStudentId = () => {
    return 'STU' + Date.now() + Math.floor(Math.random() * 1000);
};

/**
 * Submit Application
 * - Validates all required fields
 * - Checks for duplicate applications
 * - Validates course exists in department
 * - Generates unique studentId if not provided
 * - Saves application with 'Pending' status
 * - Sends confirmation email to applicant with studentId
 * - Sends notification email to admin
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
            course,
            essay
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !highSchool || !course) {
            return res.status(400).json({
                message: "Missing required fields: firstName, lastName, email, phone, highSchool, course"
            });
        }

        // Check if application already exists with this email
        const existingApplication = await Application.findOne({ email });
        if (existingApplication) {
            return res.status(400).json({
                message: "An application with this email address already exists"
            });
        }

        // Validate GPA if provided
        if (gpa !== undefined && (gpa < 0 || gpa > 4)) {
            return res.status(400).json({ message: "GPA must be between 0 and 4" });
        }

        // Validate SAT score if provided
        if (satScore !== undefined && (satScore < 400 || satScore > 1600)) {
            return res.status(400).json({ message: "SAT score must be between 400 and 1600" });
        }

        // Validate ACT score if provided
        if (actScore !== undefined && (actScore < 1 || actScore > 36)) {
            return res.status(400).json({ message: "ACT score must be between 1 and 36" });
        }

        // Validate that the course exists in the department's courses array
        // Find department by searching through all departments for the course
        let dept;
        try {
            // Find department that contains this course and populate the faculty field
            dept = await Department.findOne({
                'courses.name': course,
                'courses.isActive': { $ne: false }
            }).populate('faculty', 'name');
            
            // If still not found, try a case-insensitive partial match for course
            if (!dept) {
                dept = await Department.findOne({
                    'courses.name': { $regex: new RegExp(course, 'i') }
                }).populate('faculty', 'name');
            }
            
            // If still not found, allow submission without department validation
            if (!dept) {
                console.warn(`Department for course "${course}" not found in database, storing course without department reference`);
            }
        } catch (error) {
            console.error("Error finding department:", error);
            console.warn(`Department lookup failed, storing course without department reference`);
        }

        // Check if the course exists in the department's courses array (only if dept was found and has courses)
        let courseExists = true;
        if (dept && dept.courses && dept.courses.length > 0) {
            courseExists = dept.courses.some(c => c.name === course && c.isActive !== false);
            if (!courseExists) {
                return res.status(400).json({ 
                    message: `Course "${course}" is not available. Please select a valid course.`
                });
            }
        } else if (dept) {
            // Department exists but has no courses - skip validation
            console.warn(`Department "${dept.name}" has no courses defined, skipping course validation`);
        }
        
        // Use the found department's name and faculty name (from populated faculty)
        const departmentNameValue = dept ? dept.name : course;
        const facultyNameValue = dept && dept.faculty ? dept.faculty.name : null;

        // Generate unique studentId if not provided
        const generatedStudentId = studentId || generateStudentId();

        // Create new application with initial status 'Pending'
        const newApplication = new Application({
            studentId: generatedStudentId,
            firstName,
            lastName,
            email,
            phone,
            address: address || '',
            highSchool,
            gpa: gpa || null,
            satScore: satScore || null,
            actScore: actScore || null,
            facultyName: facultyNameValue,
            departmentName: departmentNameValue,
            course,
            essay: essay || '',
            status: 'Pending', // Set initial status to Pending
            submissionDate: new Date()
        });

        // Save to database
        const savedApplication = await newApplication.save();

        // Prepare email data object
        const applicationEmailData = {
            applicantName: `${firstName} ${lastName}`,
            id: savedApplication._id,
            studentId: savedApplication.studentId,
            status: savedApplication.status,
            submissionDate: savedApplication.submissionDate,
            faculty: savedApplication.facultyName,
            department: savedApplication.departmentName,
            course: course,
            remarks: ''
        };

        // Send notification emails to admin and applicant (non-blocking)
        try {
            const emailService = getEmailService();
            
            // Send confirmation email to applicant with studentId
            emailService.sendApplicationNotificationEmail(email, applicationEmailData)
                .then(result => {
                    if (result.success) {
                        console.log(`✓ Application confirmation sent to applicant: ${email}`);
                        console.log(`  - Student ID: ${savedApplication.studentId}`);
                    } else {
                        console.error(`✗ Failed to send application confirmation:`, result.error);
                    }
                })
                .catch(emailError => {
                    console.error("✗ Error sending application confirmation email:", emailError.message || emailError);
                });
            
            // Send detailed admin notification with complete application details
            emailService.sendAdminApplicationNotificationEmail(
                process.env.ADMIN_EMAIL || 'silasonyekachi15@gmail.com',
                savedApplication
            )
                .then(result => {
                    if (result.success) {
                        console.log(`✓ Application notification sent to admin for: ${firstName} ${lastName}`);
                        console.log(`  - Student ID: ${savedApplication.studentId}`);
                    } else {
                        console.error(`✗ Failed to send application notification:`, result.error);
                    }
                })
                .catch(emailError => {
                    console.error("✗ Error sending application notification email:", emailError.message || emailError);
                });
        } catch (emailInitError) {
            console.error("✗ Email service not available:", emailInitError.message);
        }

        // Return success response with application details including studentId
        res.status(201).json({
            message: "Application submitted successfully",
            applicationId: savedApplication._id,
            studentId: savedApplication.studentId,
            status: savedApplication.status,
            submissionDate: savedApplication.submissionDate
        });

        console.log("New application submitted:", {
            id: savedApplication._id,
            studentId: savedApplication.studentId,
            email: savedApplication.email,
            firstName: savedApplication.firstName,
            lastName: savedApplication.lastName,
            faculty: savedApplication.facultyName,
            department: savedApplication.departmentName,
            course: savedApplication.course,
            status: savedApplication.status,
            submissionDate: savedApplication.submissionDate
        });

    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get Application Status
 * - Retrieves current status, remarks, and submission/review dates
 * - Includes studentId for tracking
 */
const getApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        // Validate applicationId
        if (!applicationId) {
            return res.status(400).json({ message: "Application ID is required" });
        }

        const application = await Application.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({
            message: "Application status retrieved successfully",
            applicationId: application._id,
            studentId: application.studentId,
            firstName: application.firstName,
            lastName: application.lastName,
            email: application.email,
            status: application.status,
            remarks: application.remarks || null,
            submissionDate: application.submissionDate,
            reviewedAt: application.reviewedAt || null,
            faculty: application.facultyName,
            department: application.departmentName,
            course: application.course
        });

        console.log(`Application status retrieved - ID: ${application._id}, Student: ${application.studentId}, Status: ${application.status}`);

    } catch (error) {
        console.error("Error fetching application status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get Application Details
 * - Retrieves complete application information for applicant view
 * - Includes studentId, status, and all submitted details
 */
const getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        // Validate applicationId
        if (!applicationId) {
            return res.status(400).json({ message: "Application ID is required" });
        }

        const application = await Application.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({
            message: "Application details retrieved successfully",
            application: {
                _id: application._id,
                studentId: application.studentId,
                firstName: application.firstName,
                lastName: application.lastName,
                email: application.email,
                phone: application.phone,
                address: application.address,
                highSchool: application.highSchool,
                gpa: application.gpa,
                satScore: application.satScore,
                actScore: application.actScore,
                faculty: application.facultyName,
                department: application.departmentName,
                course: application.course,
                essay: application.essay,
                status: application.status,
                remarks: application.remarks || null,
                submissionDate: application.submissionDate,
                reviewedAt: application.reviewedAt || null
            }
        });

        console.log(`Application details retrieved - ID: ${application._id}, Student: ${application.studentId}`);

    } catch (error) {
        console.error("Error fetching application details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get All Applications with Pagination
 * - Retrieves all applications with optional filters
 * - Supports filtering by status
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
            .limit(parseInt(limit));

        const totalApplications = await Application.countDocuments(query);

        res.status(200).json({
            message: "Applications retrieved successfully",
            totalApplications,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalApplications / limit),
            applications: applications.map(app => ({
                _id: app._id,
                studentId: app.studentId,
                firstName: app.firstName,
                lastName: app.lastName,
                email: app.email,
                faculty: app.facultyName,
                department: app.departmentName,
                course: app.course,
                status: app.status,
                submissionDate: app.submissionDate,
                reviewedAt: app.reviewedAt
            }))
        });

        console.log(`Retrieved ${applications.length} applications`);

    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get Application by Email
 * - Allows students to retrieve their application using email
 */
const getApplicationByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const application = await Application.findOne({ email });

        if (!application) {
            return res.status(404).json({ message: "Application not found for this email" });
        }

        res.status(200).json({
            message: "Application retrieved successfully",
            application: {
                _id: application._id,
                studentId: application.studentId,
                firstName: application.firstName,
                lastName: application.lastName,
                email: application.email,
                phone: application.phone,
                faculty: application.facultyName,
                department: application.departmentName,
                course: application.course,
                status: application.status,
                remarks: application.remarks || null,
                submissionDate: application.submissionDate,
                reviewedAt: application.reviewedAt
            }
        });

        console.log(`Application retrieved by email - Email: ${email}, Student: ${application.studentId}`);

    } catch (error) {
        console.error("Error fetching application by email:", error);
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
