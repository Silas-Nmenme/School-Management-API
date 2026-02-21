const Application = require("../models/application.schema.js");
const { getEmailService } = require("../emails/service.js");

// Valid application statuses aligned with admin controller
const VALID_STATUSES = ['Pending', 'Under Review', 'Approved', 'Rejected', 'Accepted'];

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
            faculty,
            department,
            course,
            essay
        } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !highSchool || !faculty || !department || !course) {
            return res.status(400).json({
                message: "Missing required fields: firstName, lastName, email, phone, highSchool, faculty, department, course"
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

        // Generate studentId if not provided
        const generatedStudentId = studentId || `STU-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        // Create new application with initial status 'Pending'
        const newApplication = new Application({
            studentId: generatedStudentId,
            firstName,
            lastName,
            email,
            phone,
            address,
            highSchool,
            gpa,
            satScore,
            actScore,
            faculty,
            department,
            course,
            essay,
            status: 'Pending', // Explicitly set initial status
            submissionDate: new Date()
        });

        // Save to database
        const savedApplication = await newApplication.save();

        // Send notification emails to admin and applicant (non-blocking)
        try {
            const emailService = getEmailService();
            
            // Send confirmation email to applicant
            emailService.sendApplicationNotificationEmail(
                email,
                {
                    applicantName: `${firstName} ${lastName}`,
                    id: savedApplication._id,
                    studentId: savedApplication.studentId,
                    status: savedApplication.status,
                    submissionDate: savedApplication.submissionDate,
                    faculty: faculty,
                    department: department,
                    course: course,
                    remarks: ''
                }
            ).then(result => {
                if (result.success) {
                    console.log(`✓ Application confirmation sent to applicant: ${email}`);
                } else {
                    console.error(`✗ Failed to send application confirmation:`, result.error);
                }
            }).catch(emailError => {
                console.error("✗ Error sending application confirmation email:", emailError.message || emailError);
            });
            
            // Send detailed admin notification with all application details
            emailService.sendAdminApplicationNotificationEmail(
                process.env.ADMIN_EMAIL || 'silasonyekachi15@gmail.com',
                savedApplication
            ).then(result => {
                if (result.success) {
                    console.log(`✓ Application notification sent to admin for: ${firstName} ${lastName}`);
                } else {
                    console.error(`✗ Failed to send application notification:`, result.error);
                }
            }).catch(emailError => {
                console.error("✗ Error sending application notification email:", emailError.message || emailError);
            });
        } catch (emailInitError) {
            console.error("✗ Email service not available:", emailInitError.message);
        }

        // Return success response
        res.status(201).json({
            message: "Application submitted successfully",
            applicationId: savedApplication._id,
            status: savedApplication.status,
            submissionDate: savedApplication.submissionDate
        });

        console.log("New application submitted:", {
            id: savedApplication._id,
            email: savedApplication.email,
            faculty: savedApplication.faculty,
            department: savedApplication.department,
            course: savedApplication.course,
            status: savedApplication.status
        });

    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get application status
const getApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await Application.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({
            message: "Application status retrieved successfully",
            applicationId: application._id,
            status: application.status,
            remarks: application.remarks || null,
            submissionDate: application.submissionDate,
            reviewedAt: application.reviewedAt || null
        });
    } catch (error) {
        console.error("Error fetching application status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get application details (for applicant view)
const getApplicationDetails = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await Application.findById(applicationId);
        
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(200).json({
            message: "Application details retrieved successfully",
            application: {
                _id: application._id,
                firstName: application.firstName,
                lastName: application.lastName,
                email: application.email,
                faculty: application.faculty,
                department: application.department,
                course: application.course,
                status: application.status,
                remarks: application.remarks || null,
                submissionDate: application.submissionDate,
                reviewedAt: application.reviewedAt || null
            }
        });
    } catch (error) {
        console.error("Error fetching application details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    submitApplication,
    getApplicationStatus,
    getApplicationDetails
};
