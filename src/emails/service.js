const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper function to send email with template
const sendTemplateEmail = async (to, subject, templateName, variables) => {
    try {
        // Read the template file
        const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
        
        let htmlContent = '';
        try {
            htmlContent = fs.readFileSync(templatePath, 'utf-8');
        } catch (err) {
            console.warn(`Template not found: ${templateName}, using plain text`);
            htmlContent = `<p>${subject}</p><pre>${JSON.stringify(variables, null, 2)}</pre>`;
        }

        // Replace template variables
        Object.keys(variables).forEach(key => {
            const regex = new RegExp(`{{${key}}}`, 'g');
            htmlContent = htmlContent.replace(regex, variables[key]);
        });

        const mailOptions = {
            from: `"Student Management System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✓ Email sent to ${to}, messageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`✗ Failed to send email to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"Student Management System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✓ Email sent to ${to}, messageId: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`✗ Failed to send email to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Send welcome email to new student
 */
const sendWelcomeEmail = async (studentData, password) => {
    const variables = {
        firstname: studentData.firstname || studentData.firstName || studentData.Firstname || '',
        lastname: studentData.lastname || studentData.lastName || studentData.Lastname || '',
        studentId: studentData.studentId || '',
        email: studentData.email || '',
        age: studentData.age || '',
        phone: studentData.phone || '',
        registrationDate: studentData.registrationDate || new Date().toLocaleDateString(),
        loginUrl: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/login`,
        tempPassword: password || 'Check your email for password',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        studentData.email,
        'Welcome to Student Management System!',
        'welcome-email',
        variables
    );
};

/**
 * Send login alert email
 */
const sendLoginAlert = async (loginData) => {
    const variables = {
        EMAIL: loginData.email || '',
        LOGIN_TIME: loginData.loginTime || new Date().toLocaleString(),
        IP_ADDRESS: loginData.ip || 'Unknown',
        LOCATION: loginData.location || 'Unknown',
        DEVICE_INFO: loginData.deviceInfo || 'Unknown Device',
        BROWSER_INFO: loginData.browserInfo || 'Unknown Browser',
        SESSION_ID: loginData.sessionId || 'N/A',
        SECURITY_STATUS: loginData.isSuspicious ? 'Suspicious' : 'Normal',
        RISK_LEVEL: loginData.riskLevel || (loginData.isSuspicious ? 'High' : 'Low'),
        AUTH_METHOD: loginData.authMethod || 'Password',
        SECURITY_URL: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/security`
    };

    const subject = loginData.isSuspicious ? '⚠️ Suspicious Login Detected' : 'New Login to Your Account';

    return await sendTemplateEmail(
        loginData.email,
        subject,
        'login-alert-email',
        variables
    );
};

/**
 * Send OTP verification email
 */
const sendOtpEmail = async (studentData, otp) => {
    const variables = {
        firstname: studentData.Firstname || studentData.firstName || '',
        email: studentData.email || '',
        otp: otp || '',
        requestTime: new Date().toLocaleString(),
        otpExpiry: '10 minutes',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        studentData.email,
        'Your OTP Verification Code',
        'otp-verification-email',
        variables
    );
};

/**
 * Send password reset confirmation email
 */
const sendPasswordResetEmail = async (studentData) => {
    const variables = {
        firstname: studentData.Firstname || studentData.firstName || '',
        lastname: studentData.Lastname || studentData.lastName || '',
        email: studentData.email || '',
        resetTime: new Date().toLocaleString(),
        loginUrl: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/login`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        studentData.email,
        'Password Reset Successful',
        'password-reset-confirmation',
        variables
    );
};

/**
 * Send admin promotion email
 */
const sendAdminPromotionEmail = async (studentData) => {
    const variables = {
        firstname: studentData.Firstname || studentData.firstName || '',
        lastname: studentData.Lastname || studentData.lastName || '',
        email: studentData.email || '',
        adminPortalUrl: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/admin`,
        promotionDate: new Date().toLocaleDateString(),
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        studentData.email,
        'You Have Been Promoted to Admin',
        'admin-promotion-email',
        variables
    );
};

/**
 * Send admin notification email
 */
const sendAdminNotificationEmail = async (adminEmail, subject, message, details = {}) => {
    const variables = {
        ADMIN_EMAIL: adminEmail || '',
        MESSAGE: message || '',
        NOTIFICATION_TIME: new Date().toLocaleString(),
        ...details
    };

    return await sendTemplateEmail(
        adminEmail,
        subject,
        'admin-notification-email',
        variables
    );
};

/**
 * Send course registration confirmation
 */
const sendCourseRegistrationEmail = async (studentData, courseData) => {
    const variables = {
        firstname: studentData.Firstname || studentData.firstName || '',
        lastname: studentData.Lastname || studentData.lastName || '',
        email: studentData.email || '',
        courseName: courseData.name || '',
        courseId: courseData.courseId || '',
        registrationDate: new Date().toLocaleDateString(),
        courseUrl: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/courses/${courseData.courseId}`,
        instructorName: courseData.instructor?.Firstname || courseData.instructor?.firstName || courseData.instructor?.name || 'Instructor',
        updateDate: new Date().toLocaleDateString(),
        updateTime: new Date().toLocaleTimeString(),
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        studentData.email,
        `Course Registration: ${courseData.name}`,
        'course-update-email',
        variables
    );
};

/**
 * Send application notification email
 */
const sendApplicationNotificationEmail = async (email, applicationData) => {
    // Format dates
    const submissionDate = applicationData.submissionDate 
        ? new Date(applicationData.submissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
    
    const reviewDate = applicationData.reviewedAt 
        ? new Date(applicationData.reviewedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' })
        : 'Pending';

    // Determine status class for CSS styling
    const statusClass = (applicationData.status || 'Pending').toLowerCase().replace(/\s+/g, '-');

    // Build next steps based on application status
    let nextStepsContent = '';
    switch (applicationData.status) {
        case 'Pending':
            nextStepsContent = '<p>Your application is currently in our review queue. Our admissions committee will carefully evaluate your qualifications and will contact you within 5-7 business days with a decision.</p>';
            break;
        case 'Under Review':
            nextStepsContent = '<p>Your application is currently being reviewed by our admissions committee. We will notify you of the outcome shortly. In the meantime, please ensure we have your correct contact information.</p>';
            break;
        case 'Approved':
            nextStepsContent = '<p>Congratulations! Your application has been approved. We will be in touch with you shortly regarding the next steps in the admission process, including enrollment details and required documentation.</p>';
            break;
        case 'Accepted':
            nextStepsContent = '<p>🎉 Welcome to our institution! Your application has been accepted. Please complete your enrollment process by following the instructions we\'ll send you shortly. If you have any questions, don\'t hesitate to contact our admissions office.</p>';
            break;
        case 'Rejected':
            nextStepsContent = '<p>Thank you for considering our institution. Unfortunately, at this time, we are unable to offer you admission. We encourage you to apply again in the future. For more information or to discuss your application, please contact our admissions office.</p>';
            break;
        default:
            nextStepsContent = '<p>Your application is being processed. We will contact you soon with an update on your application status.</p>';
    }

    // Build remarks section if remarks exist
    let remarksSection = '';
    if (applicationData.remarks && applicationData.remarks.trim()) {
        remarksSection = `<div class="remarks-section">
            <h4>📌 Remarks from Review Committee:</h4>
            <div class="remarks-content">
                ${applicationData.remarks}
            </div>
        </div>`;
    }

    const variables = {
        APPLICANT_NAME: applicationData.applicantName || 'Applicant',
        EMAIL: email || '',
        APPLICATION_ID: applicationData.id || 'N/A',
        APPLICATION_STATUS: applicationData.status || 'Pending',
        STATUS_CLASS: statusClass,
        SUBMISSION_DATE: submissionDate,
        SUBMISSION_TIME: applicationData.submissionDate ? new Date(applicationData.submissionDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A',
        FACULTY: applicationData.faculty || 'Not specified',
        DEPARTMENT: applicationData.department || 'Not specified',
        COURSE: applicationData.course || 'Not specified',
        REMARKS: applicationData.remarks || '',
        REMARKS_SECTION: remarksSection,
        NEXT_STEPS_CONTENT: nextStepsContent,
        REVIEW_DATE: reviewDate,
        STUDENT_ID: applicationData.studentId || 'N/A',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000',
        SUPPORT_PHONE: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        email,
        'Application Status Update',
        'application-notification-email',
        variables
    );
};

/**
 * Send application notification email to admin
 */
const sendAdminApplicationNotificationEmail = async (adminEmail, applicationData) => {
    const variables = {
        APPLICATION_ID: applicationData._id || applicationData.id || '',
        APPLICANT_NAME: `${applicationData.firstName} ${applicationData.lastName}` || '',
        APPLICANT_EMAIL: applicationData.email || '',
        APPLICANT_PHONE: applicationData.phone || '',
        APPLICANT_ADDRESS: applicationData.address || 'N/A',
        HIGH_SCHOOL: applicationData.highSchool || '',
        GPA: applicationData.gpa || 'Not provided',
        SAT_SCORE: applicationData.satScore || 'Not provided',
        ACT_SCORE: applicationData.actScore || 'Not provided',
        FACULTY: applicationData.faculty || '',
        DEPARTMENT: applicationData.department || '',
        COURSE: applicationData.course || '',
        ESSAY: applicationData.essay || 'No essay provided',
        APPLICATION_STATUS: applicationData.status || 'Pending',
        SUBMISSION_DATE: new Date(applicationData.submissionDate).toLocaleDateString() || new Date().toLocaleDateString(),
        SUBMISSION_TIME: new Date(applicationData.submissionDate).toLocaleTimeString() || new Date().toLocaleTimeString(),
        ADMIN_PORTAL_LINK: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/admin/applications/${applicationData._id || applicationData.id}`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000',
        SUPPORT_PHONE: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        adminEmail,
        'New Student Application Submitted - Action Required',
        'admin-application-notification',
        variables
    );
};

/**
 * Send visit confirmation email
 */
const sendVisitConfirmationEmail = async (visitorData, visitData) => {
    const variables = {
        firstname: visitorData.Firstname || visitorData.firstName || '',
        email: visitorData.email || '',
        visitDate: visitData.visitDate || '',
        visitTime: visitData.visitTime || '',
        purpose: visitData.purpose || '',
        confirmationNumber: visitData.confirmationNumber || '',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        visitorData.email,
        'Visit Confirmation',
        'visit-confirmation-email',
        variables
    );
};

/**
 * Send visit status update email
 */
const sendVisitStatusUpdateEmail = async (visitData) => {
    const variables = {
        FIRST_NAME: visitData.visitor?.firstName || visitData.visitorName || '',
        LAST_NAME: visitData.visitor?.lastName || '',
        email: visitData.visitor?.email || '',
        visitDate: visitData.visitDate || '',
        visitTime: visitData.visitTime || '',
        purpose: visitData.purpose || '',
        STATUS: visitData.status || '',
        confirmationNumber: visitData.confirmationNumber || '',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        visitData.visitor?.email,
        'Visit Status Update',
        'visit-status-update-email',
        variables
    );
};

/**
 * Send visit deletion email
 */
const sendVisitDeletionEmail = async (visitData) => {
    const variables = {
        firstname: visitData.visitor?.firstName || visitData.visitorName || '',
        email: visitData.visitor?.email || '',
        visitDate: visitData.visitDate || '',
        visitTime: visitData.visitTime || '',
        purpose: visitData.purpose || '',
        confirmationNumber: visitData.confirmationNumber || '',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        visitData.visitor?.email,
        'Visit Cancelled',
        'visit-notification-email',
        variables
    );
};

/**
 * Send profile update email
 */
const sendProfileUpdateEmail = async (studentData) => {
    const variables = {
        firstname: studentData.Firstname || studentData.firstName || '',
        lastname: studentData.Lastname || studentData.lastName || '',
        email: studentData.email || '',
        updateTime: new Date().toLocaleString(),
        profileUrl: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/profile`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        studentData.email,
        'Profile Updated',
        'settings-update-email',
        variables
    );
};

/**
 * Send course unregistration email
 */
const sendCourseUnregistrationEmail = async (studentData, courseData) => {
    const variables = {
        firstname: studentData.Firstname || studentData.firstName || '',
        lastname: studentData.Lastname || studentData.lastName || '',
        email: studentData.email || '',
        courseName: courseData.name || '',
        courseId: courseData.courseId || '',
        unregistrationDate: new Date().toLocaleDateString(),
        coursesUrl: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/courses`,
        instructorName: courseData.instructor?.Firstname || courseData.instructor?.firstName || courseData.instructor?.name || 'Instructor',
        updateDate: new Date().toLocaleDateString(),
        updateTime: new Date().toLocaleTimeString(),
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        studentData.email,
        `Course Unregistration: ${courseData.name}`,
        'course-update-email',
        variables
    );
};

/**
 * Send support request email
 */
const sendSupportRequest = async (supportData) => {
    const variables = {
        name: supportData.name || '',
        email: supportData.email || '',
        subject: supportData.subject || '',
        message: supportData.message || '',
        submissionTime: new Date().toLocaleString()
    };

    return await sendTemplateEmail(
        process.env.SUPPORT_EMAIL || 'support@example.com',
        `Support Request: ${supportData.subject || 'New Inquiry'}`,
        'contact-confirmation-email',
        variables
    );
};

/**
 * Send account deletion email
 */
const sendAccountDeletionEmail = async (userData, options = {}) => {
    const variables = {
        firstname: userData.Firstname || userData.firstName || '',
        lastname: userData.Lastname || userData.lastName || '',
        email: userData.email || '',
        deletionDate: new Date().toLocaleDateString(),
        deletionMethod: options.method || 'Self Deletion',
        adminEmail: options.adminEmail || '',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        userData.email,
        'Account Deletion Confirmation',
        'account-deletion-email',
        variables
    );
};

/**
 * Send staff welcome email
 */
const sendStaffWelcomeEmail = async (staffData) => {
    const variables = {
        firstname: staffData.Firstname || staffData.firstName || '',
        lastname: staffData.Lastname || staffData.lastName || '',
        email: staffData.email || '',
        role: staffData.role || 'Staff',
        loginUrl: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/login`,
        tempPassword: staffData.tempPassword || 'Check your email for password',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        staffData.email,
        'Welcome to the Team!',
        'staff-welcome-email',
        variables
    );
};

/**
 * Send course creation email
 */
const sendCourseCreationEmail = async (courseData) => {
    const variables = {
        courseName: courseData.name || '',
        courseId: courseData.courseId || '',
        instructor: courseData.instructor || '',
        creationDate: new Date().toLocaleDateString(),
        courseUrl: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/courses/${courseData.courseId}`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        process.env.ADMIN_EMAIL || 'admin@example.com',
        `New Course Created: ${courseData.name}`,
        'admin-notification-email',
        variables
    );
};

/**
 * Send course update email
 */
const sendCourseUpdateEmail = async (courseData) => {
    const instructorEmail = courseData.instructor?.email || courseData.instructorEmail || process.env.ADMIN_EMAIL || 'admin@example.com';
    const variables = {
        instructorName: courseData.instructor?.name || courseData.instructorName || '',
        courseName: courseData.name || '',
        courseId: courseData.courseId || '',
        updateDate: new Date().toLocaleDateString(),
        updateTime: new Date().toLocaleTimeString(),
        courseUrl: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/courses/${courseData.courseId}`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        instructorEmail,
        `Course Updated: ${courseData.name}`,
        'course-update-email',
        variables
    );
};

/**
 * Send course deletion email
 */
const sendCourseDeletionEmail = async (courseData) => {
    const instructorEmail = courseData.instructor?.email || courseData.instructorEmail || process.env.ADMIN_EMAIL || 'admin@example.com';
    const variables = {
        instructorName: courseData.instructor?.name || courseData.instructorName || '',
        courseName: courseData.name || '',
        courseId: courseData.courseId || '',
        deletionDate: new Date().toLocaleDateString(),
        deletionTime: new Date().toLocaleTimeString(),
        coursesUrl: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/courses`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        instructorEmail,
        `Course Deleted: ${courseData.name}`,
        'course-deletion-email',
        variables
    );
};

/**
 * Send settings update email
 */
const sendSettingsUpdateEmail = async (settings, adminEmail) => {
    const variables = {
        adminEmail: adminEmail || '',
        updateTime: new Date().toLocaleString(),
        settingsUrl: `${process.env.APP_URL || 'https://bethelcollege.netlify.app'}/admin/settings`,
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        supportPhone: process.env.SUPPORT_PHONE || '+1-800-000-0000'
    };

    return await sendTemplateEmail(
        adminEmail,
        'Settings Updated',
        'settings-update-email',
        variables
    );
};

/**
 * Get email service instance - returns an object with all email methods
 */
const getEmailService = () => {
    return {
        sendEmail,
        sendWelcomeEmail,
        sendLoginAlert,
        sendOtpEmail,
        sendPasswordResetEmail,
        sendAdminPromotionEmail,
        sendAdminNotificationEmail,
        sendCourseRegistrationEmail,
        sendApplicationNotificationEmail,
        sendAdminApplicationNotificationEmail,
        sendVisitConfirmationEmail,
        sendVisitStatusUpdateEmail,
        sendVisitDeletionEmail,
        sendProfileUpdateEmail,
        sendCourseUnregistrationEmail,
        sendSupportRequest,
        sendAccountDeletionEmail,
        sendStaffWelcomeEmail,
        sendCourseCreationEmail,
        sendCourseUpdateEmail,
        sendCourseDeletionEmail,
        sendSettingsUpdateEmail
    };
};

module.exports = {
    getEmailService,
    sendEmail,
    sendWelcomeEmail,
    sendLoginAlert,
    sendOtpEmail,
    sendPasswordResetEmail,
    sendAdminPromotionEmail,
    sendAdminNotificationEmail,
    sendCourseRegistrationEmail,
    sendApplicationNotificationEmail,
    sendAdminApplicationNotificationEmail,
    sendVisitConfirmationEmail,
    sendVisitStatusUpdateEmail,
    sendVisitDeletionEmail,
    sendProfileUpdateEmail,
    sendCourseUnregistrationEmail,
    sendSupportRequest,
    sendAccountDeletionEmail,
    sendStaffWelcomeEmail,
    sendCourseCreationEmail,
    sendCourseUpdateEmail,
    sendCourseDeletionEmail,
    sendSettingsUpdateEmail
};
