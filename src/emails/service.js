/**
 * Email Service
 * Core email sending functionality using Nodemailer
 */

const nodemailer = require('nodemailer');
const TemplateManager = require('./template-manager');

class EmailService {
    constructor() {
        const { EMAIL_USER, EMAIL_PASS, EMAIL_HOST, EMAIL_PORT } = process.env;

        if (!EMAIL_USER || !EMAIL_PASS) {
            throw new Error('Missing EMAIL_USER or EMAIL_PASS in environment variables');
        }

        this.emailUser = EMAIL_USER;
        this.templateManager = new TemplateManager();

        // Create Gmail transporter
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify connection
        this.verifyConnection();
    }

    /**
     * Verify the transporter connection
     */
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✓ Email transporter verified successfully');
            return true;
        } catch (error) {
            console.error('✗ Email transporter verification failed:', error.message);
            return false;
        }
    }

    /**
     * Send a simple email
     * @param {string} to - Recipient email
     * @param {string} subject - Email subject
     * @param {string} html - Email HTML content
     * @returns {Object} Result object with success flag
     */
    async sendEmail(to, subject, html) {
        try {
            const mailOptions = {
                from: `"Student Management System" <${this.emailUser}>`,
                to,
                subject,
                html
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✓ Email sent to ${to}, messageId: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(`✗ Failed to send email to ${to}:`, error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send email using template
     * @param {string} to - Recipient email
     * @param {string} subject - Email subject
     * @param {string} templateName - Name of template to use
     * @param {Object} variables - Variables for template
     * @returns {Object} Result object
     */
    async sendTemplateEmail(to, subject, templateName, variables = {}) {
        try {
            // Add support and app URL if not provided
            if (!variables.SUPPORT_EMAIL) {
                variables.SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@example.com';
            }
            if (!variables.SUPPORT_PHONE) {
                variables.SUPPORT_PHONE = process.env.SUPPORT_PHONE || '+1-xxx-xxx-xxxx';
            }
            if (!variables.APP_URL) {
                variables.APP_URL = process.env.APP_URL || 'https://app.example.com';
            }

            const html = this.templateManager.processTemplate(templateName, variables);
            if (!html) {
                throw new Error(`Template '${templateName}' not found`);
            }

            return await this.sendEmail(to, subject, html);
        } catch (error) {
            console.error(`✗ Failed to send template email (${templateName}):`, error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send welcome email to new student
     */
    async sendWelcomeEmail(studentData, password) {
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

        return await this.sendTemplateEmail(
            studentData.email,
            'Welcome to Student Management System!',
            'welcome-email',
            variables
        );
    }

    /**
     * Send login alert email
     */
    async sendLoginAlert(loginData) {
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

        return await this.sendTemplateEmail(
            loginData.email,
            subject,
            'login-alert-email',
            variables
        );
    }

    /**
     * Send OTP verification email
     */
    async sendOtpEmail(studentData, otp) {
        const variables = {
            FIRSTNAME: studentData.Fistname || studentData.firstName || '',
            EMAIL: studentData.email || '',
            OTP: otp || '',
            REQUEST_TIME: new Date().toLocaleString(),
            OTP_EXPIRY: '10 minutes'
        };

        return await this.sendTemplateEmail(
            studentData.email,
            'Your OTP Verification Code',
            'otp-verification-email',
            variables
        );
    }

    /**
     * Send password reset confirmation email
     */
    async sendPasswordResetEmail(studentData) {
        const variables = {
            FIRSTNAME: studentData.Fistname || studentData.firstName || '',
            EMAIL: studentData.email || '',
            RESET_TIME: new Date().toLocaleString(),
            LOGIN_URL: `${process.env.APP_URL}/login`
        };

        return await this.sendTemplateEmail(
            studentData.email,
            'Password Reset Successful',
            'password-reset-confirmation',
            variables
        );
    }

    /**
     * Send admin promotion email
     */
    async sendAdminPromotionEmail(studentData) {
        const variables = {
            FIRSTNAME: studentData.Fistname || studentData.firstName || '',
            LASTNAME: studentData.Lastname || studentData.lastName || '',
            EMAIL: studentData.email || '',
            ADMIN_PORTAL_URL: `${process.env.APP_URL}/admin`,
            PROMOTION_DATE: new Date().toLocaleDateString()
        };

        return await this.sendTemplateEmail(
            studentData.email,
            'You Have Been Promoted to Admin',
            'admin-promotion-email',
            variables
        );
    }

    /**
     * Send admin notification email
     */
    async sendAdminNotificationEmail(adminEmail, subject, message, details = {}) {
        const variables = {
            ADMIN_EMAIL: adminEmail || '',
            MESSAGE: message || '',
            NOTIFICATION_TIME: new Date().toLocaleString(),
            ...details
        };

        return await this.sendTemplateEmail(
            adminEmail,
            subject,
            'admin-notification-email',
            variables
        );
    }

    /**
     * Send course registration confirmation
     */
    async sendCourseRegistrationEmail(studentData, courseData) {
        const variables = {
            FIRSTNAME: studentData.Fistname || studentData.firstName || '',
            LASTNAME: studentData.Lastname || studentData.lastName || '',
            EMAIL: studentData.email || '',
            COURSE_NAME: courseData.name || '',
            COURSE_ID: courseData.courseId || '',
            REGISTRATION_DATE: new Date().toLocaleDateString(),
            COURSE_URL: `${process.env.APP_URL}/courses/${courseData.courseId}`
        };

        return await this.sendTemplateEmail(
            studentData.email,
            `Course Registration: ${courseData.name}`,
            'course-update-email',
            variables
        );
    }

    /**
     * Send application notification email
     */
    async sendApplicationNotificationEmail(email, applicationData) {
        const variables = {
            EMAIL: email || '',
            APPLICATION_ID: applicationData.id || '',
            APPLICATION_STATUS: applicationData.status || 'Pending',
            SUBMISSION_DATE: applicationData.submissionDate || new Date().toLocaleDateString(),
            APPLICATION_URL: `${process.env.APP_URL}/applications/${applicationData.id}`
        };

        return await this.sendTemplateEmail(
            email,
            'Application Status Update',
            'application-notification-email',
            variables
        );
    }

    /**
     * Send visit confirmation email
     */
    async sendVisitConfirmationEmail(visitorData, visitData) {
        const variables = {
            FIRSTNAME: visitorData.Fistname || visitorData.firstName || '',
            EMAIL: visitorData.email || '',
            VISIT_DATE: visitData.visitDate || '',
            VISIT_TIME: visitData.visitTime || '',
            PURPOSE: visitData.purpose || '',
            CONFIRMATION_NUMBER: visitData.confirmationNumber || ''
        };

        return await this.sendTemplateEmail(
            visitorData.email,
            'Visit Confirmation',
            'visit-confirmation-email',
            variables
        );
    }
}

// Singleton instance
let serviceInstance = null;

/**
 * Get or create email service instance
 */
function getEmailService() {
    if (!serviceInstance) {
        try {
            serviceInstance = new EmailService();
        } catch (error) {
            console.error('✗ Failed to initialize email service:', error.message);
            throw error;
        }
    }
    return serviceInstance;
}

module.exports = {
    getEmailService,
    EmailService
};
