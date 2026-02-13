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
        FIRSTNAME: studentData.Fistname || studentData.firstName || '',
        LASTNAME: studentData.Lastname || studentData.lastName || '',
        STUDENT_ID: studentData.studentId || '',
        EMAIL: studentData.email || '',
        AGE: studentData.age || '',
        PHONE: studentData.phone || '',
        REGISTRATION_DATE: new Date().toLocaleDateString(),
        LOGIN_URL: `${process.env.APP_URL}/login`,
        TEMP_PASSWORD: password || 'Check your email for password'
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
        SECURITY_URL: `${process.env.APP_URL}/security`
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
        FIRSTNAME: studentData.Fistname || studentData.firstName || '',
        EMAIL: studentData.email || '',
        OTP: otp || '',
        REQUEST_TIME: new Date().toLocaleString(),
        OTP_EXPIRY: '10 minutes'
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
        FIRSTNAME: studentData.Fistname || studentData.firstName || '',
        EMAIL: studentData.email || '',
        RESET_TIME: new Date().toLocaleString(),
        LOGIN_URL: `${process.env.APP_URL}/login`
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
        FIRSTNAME: studentData.Fistname || studentData.firstName || '',
        LASTNAME: studentData.Lastname || studentData.lastName || '',
        EMAIL: studentData.email || '',
        ADMIN_PORTAL_URL: `${process.env.APP_URL}/admin`,
        PROMOTION_DATE: new Date().toLocaleDateString()
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
        FIRSTNAME: studentData.Fistname || studentData.firstName || '',
        LASTNAME: studentData.Lastname || studentData.lastName || '',
        EMAIL: studentData.email || '',
        COURSE_NAME: courseData.name || '',
        COURSE_ID: courseData.courseId || '',
        REGISTRATION_DATE: new Date().toLocaleDateString(),
        COURSE_URL: `${process.env.APP_URL}/courses/${courseData.courseId}`
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
    const variables = {
        EMAIL: email || '',
        APPLICATION_ID: applicationData.id || '',
        APPLICATION_STATUS: applicationData.status || 'Pending',
        SUBMISSION_DATE: applicationData.submissionDate || new Date().toLocaleDateString(),
        APPLICATION_URL: `${process.env.APP_URL}/applications/${applicationData.id}`
    };

    return await sendTemplateEmail(
        email,
        'Application Status Update',
        'application-notification-email',
        variables
    );
};

/**
 * Send visit confirmation email
 */
const sendVisitConfirmationEmail = async (visitorData, visitData) => {
    const variables = {
        FIRSTNAME: visitorData.Fistname || visitorData.firstName || '',
        EMAIL: visitorData.email || '',
        VISIT_DATE: visitData.visitDate || '',
        VISIT_TIME: visitData.visitTime || '',
        PURPOSE: visitData.purpose || '',
        CONFIRMATION_NUMBER: visitData.confirmationNumber || ''
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
        FIRSTNAME: visitData.visitor?.firstName || visitData.visitorName || '',
        EMAIL: visitData.visitor?.email || '',
        VISIT_DATE: visitData.visitDate || '',
        VISIT_TIME: visitData.visitTime || '',
        PURPOSE: visitData.purpose || '',
        STATUS: visitData.status || '',
        CONFIRMATION_NUMBER: visitData.confirmationNumber || ''
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
        FIRSTNAME: visitData.visitor?.firstName || visitData.visitorName || '',
        EMAIL: visitData.visitor?.email || '',
        VISIT_DATE: visitData.visitDate || '',
        VISIT_TIME: visitData.visitTime || '',
        PURPOSE: visitData.purpose || '',
        CONFIRMATION_NUMBER: visitData.confirmationNumber || ''
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
        FIRSTNAME: studentData.Fistname || studentData.firstName || '',
        LASTNAME: studentData.Lastname || studentData.lastName || '',
        EMAIL: studentData.email || '',
        UPDATE_TIME: new Date().toLocaleString(),
        PROFILE_URL: `${process.env.APP_URL}/profile`
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
        FIRSTNAME: studentData.Fistname || studentData.firstName || '',
        LASTNAME: studentData.Lastname || studentData.lastName || '',
        EMAIL: studentData.email || '',
        COURSE_NAME: courseData.name || '',
        COURSE_ID: courseData.courseId || '',
        UNREGISTRATION_DATE: new Date().toLocaleDateString(),
        COURSES_URL: `${process.env.APP_URL}/courses`
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
        NAME: supportData.name || '',
        EMAIL: supportData.email || '',
        SUBJECT: supportData.subject || '',
        MESSAGE: supportData.message || '',
        SUBMISSION_TIME: new Date().toLocaleString()
    };

    return await sendTemplateEmail(
        process.env.SUPPORT_EMAIL || 'support@example.com',
        `Support Request: ${supportData.subject || 'New Inquiry'}`,
        'staff-welcome-email',
        variables
    );
};

/**
 * Send account deletion email
 */
const sendAccountDeletionEmail = async (userData, options = {}) => {
    const variables = {
        FIRSTNAME: userData.Fistname || userData.firstName || '',
        LASTNAME: userData.Lastname || userData.lastName || '',
        EMAIL: userData.email || '',
        DELETION_DATE: new Date().toLocaleDateString(),
        DELETION_METHOD: options.method || 'Self Deletion',
        ADMIN_EMAIL: options.adminEmail || ''
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
        FIRSTNAME: staffData.Fistname || staffData.firstName || '',
        LASTNAME: staffData.Lastname || staffData.lastName || '',
        EMAIL: staffData.email || '',
        ROLE: staffData.role || 'Staff',
        LOGIN_URL: `${process.env.APP_URL}/login`,
        TEMP_PASSWORD: staffData.tempPassword || 'Check your email for password'
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
        COURSE_NAME: courseData.name || '',
        COURSE_ID: courseData.courseId || '',
        INSTRUCTOR: courseData.instructor || '',
        CREATION_DATE: new Date().toLocaleDateString(),
        COURSE_URL: `${process.env.APP_URL}/courses/${courseData.courseId}`
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
    const variables = {
        COURSE_NAME: courseData.name || '',
        COURSE_ID: courseData.courseId || '',
        UPDATE_DATE: new Date().toLocaleDateString(),
        COURSE_URL: `${process.env.APP_URL}/courses/${courseData.courseId}`
    };

    return await sendTemplateEmail(
        process.env.ADMIN_EMAIL || 'admin@example.com',
        `Course Updated: ${courseData.name}`,
        'course-update-email',
        variables
    );
};

/**
 * Send course deletion email
 */
const sendCourseDeletionEmail = async (courseData) => {
    const variables = {
        COURSE_NAME: courseData.name || '',
        COURSE_ID: courseData.courseId || '',
        DELETION_DATE: new Date().toLocaleDateString(),
        COURSES_URL: `${process.env.APP_URL}/courses`
    };

    return await sendTemplateEmail(
        process.env.ADMIN_EMAIL || 'admin@example.com',
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
        ADMIN_EMAIL: adminEmail || '',
        UPDATE_TIME: new Date().toLocaleString(),
        SETTINGS_URL: `${process.env.APP_URL}/admin/settings`
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
