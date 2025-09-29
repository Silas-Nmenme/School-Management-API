const Application = require("../models/application.schema.js");
const EmailService = require("../templates/email-service");

const emailService = new EmailService();

const submitApplication = async (req, res) => {
    try {
        const {
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

        // Create new application
        const newApplication = new Application({
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
        });

        // Save to database
        const savedApplication = await newApplication.save();

        // Send notification email to admin (non-blocking)
        emailService.sendApplicationNotification(savedApplication).catch(emailError => {
            console.error("Failed to send application notification email:", emailError.message);
            // Don't fail the application submission if email fails
        });

        // Return success response
        res.status(201).json({
            message: "Application submitted successfully",
            applicationId: savedApplication._id,
            submissionDate: savedApplication.submissionDate
        });

        console.log("New application submitted:", {
            id: savedApplication._id,
            email: savedApplication.email,
            faculty: savedApplication.faculty,
            department: savedApplication.department,
            course: savedApplication.course
        });

    } catch (error) {
        console.error("Error submitting application:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    submitApplication
};
