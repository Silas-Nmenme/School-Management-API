/**
 * Email Service for Student Management System
 * Handles sending emails using templates for various system events
 */

const nodemailer = require('nodemailer');
const { EmailTemplateManager } = require('./email-templates');

class EmailService {
    constructor() {
        this.emailManager = new EmailTemplateManager();
        this.transporter = this.initializeTransporter();
    }

    initializeTransporter() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendEmail(to, subject, htmlContent) {
        try {
            const mailOptions = {
                from: `"Student Management System" <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
                to,
                subject,
                html: htmlContent
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    // Welcome email for new student registration
    async sendWelcomeEmail(studentData, originalPassword) {
        try {
            const variables = {
                firstname: studentData.Fistname,
                lastname: studentData.Lastname,
                studentId: studentData.studentId,
                email: studentData.email,
                age: studentData.age,
                phone: studentData.phone,
                registrationDate: new Date().toLocaleDateString(),
                tempPassword: originalPassword, // Send actual password
                loginUrl: `${process.env.APP_URL}/login`,
                supportEmail: process.env.SUPPORT_EMAIL,
                supportPhone: process.env.SUPPORT_PHONE
            };

            const html = this.emailManager.processTemplate('welcome-email', variables);
            return await this.sendEmail(studentData.email, 'Welcome to Student Management System!', html);
        } catch (error) {
            console.error('Error sending welcome email:', error);
            return { success: false, error: error.message };
        }
    }

    // OTP email for password reset
    async sendOtpEmail(email, otp, firstname) {
        try {
            const variables = {
                firstname: firstname,
                email: email,
                otp: otp,
                requestTime: new Date().toLocaleString(),
                ipAddress: 'System Generated',
                resetUrl: `${process.env.APP_URL}/reset-password`,
                supportEmail: process.env.SUPPORT_EMAIL,
                supportPhone: process.env.SUPPORT_PHONE
            };

            const html = this.emailManager.processTemplate('otp-verification-email', variables);
            return await this.sendEmail(email, 'Password Reset OTP - Student Management System', html);
        } catch (error) {
            console.error('Error sending OTP email:', error);
            return { success: false, error: error.message };
        }
    }

    // Password reset confirmation email
    async sendPasswordResetConfirmation(studentData) {
        try {
            const variables = {
                firstname: studentData.Fistname,
                lastname: studentData.Lastname,
                email: studentData.email,
                resetTime: new Date().toLocaleString(),
                ipAddress: 'System Generated',
                loginUrl: `${process.env.APP_URL}/login`,
                supportEmail: process.env.SUPPORT_EMAIL,
                supportPhone: process.env.SUPPORT_PHONE
            };

            const html = this.emailManager.processTemplate('password-reset-confirmation', variables);
            return await this.sendEmail(studentData.email, 'Password Reset Successful', html);
        } catch (error) {
            console.error('Error sending password reset confirmation:', error);
            return { success: false, error: error.message };
        }
    }

    // Admin promotion email
    async sendAdminPromotionEmail(studentData, promotedBy) {
        try {
            const variables = {
                firstname: studentData.Fistname,
                lastname: studentData.Lastname,
                studentId: studentData.studentId,
                email: studentData.email,
                promotionDate: new Date().toLocaleDateString(),
                promotedBy: promotedBy || 'System Administrator',
                adminDashboardUrl: `${process.env.APP_URL}/admin`,
                adminSupportEmail: process.env.ADMIN_SUPPORT_EMAIL,
                supportPhone: process.env.SUPPORT_PHONE
            };

            const html = this.emailManager.processTemplate('admin-promotion-email', variables);
            return await this.sendEmail(studentData.email, 'Admin Access Granted - Student Management System', html);
        } catch (error) {
            console.error('Error sending admin promotion email:', error);
            return { success: false, error: error.message };
        }
    }

    // Account deletion confirmation email
    async sendAccountDeletionEmail(studentData, deletionInfo) {
        try {
            const variables = {
                firstname: studentData.Fistname,
                lastname: studentData.Lastname,
                studentId: studentData.studentId,
                email: studentData.email,
                deletionDate: new Date().toLocaleDateString(),
                deletionMethod: deletionInfo.method || 'User Request',
                requestedBy: deletionInfo.requestedBy || 'User',
                supportUrl: `${process.env.APP_URL}/support`,
                supportEmail: process.env.SUPPORT_EMAIL,
                supportPhone: process.env.SUPPORT_PHONE
            };

            const html = this.emailManager.processTemplate('account-deletion-email', variables);
            return await this.sendEmail(studentData.email, 'Account Deletion Confirmation', html);
        } catch (error) {
            console.error('Error sending account deletion email:', error);
            return { success: false, error: error.message };
        }
    }

    // Login alert email
    async sendLoginAlert(loginData) {
        try {
            const variables = {
                EMAIL: loginData.email,
                LOGIN_TIME: new Date().toLocaleString(),
                IP_ADDRESS: loginData.ip || 'Unknown',
                LOCATION: loginData.location || 'Unknown',
                DEVICE_INFO: loginData.deviceInfo || 'Unknown Device',
                BROWSER_INFO: loginData.browserInfo || 'Unknown Browser',
                SESSION_ID: loginData.sessionId || 'N/A',
                SECURITY_STATUS: loginData.isSuspicious ? 'Suspicious' : 'Normal',
                RISK_LEVEL: loginData.isSuspicious ? 'High' : 'Low',
                AUTH_METHOD: loginData.authMethod || 'Password',
                IS_SUSPICIOUS: loginData.isSuspicious || false,
                SECURITY_URL: `${process.env.APP_URL}/security`,
                SECURITY_EMAIL: process.env.SECURITY_EMAIL,
                SUPPORT_PHONE: process.env.SUPPORT_PHONE
            };

            const html = this.emailManager.processTemplate('login-alert-email', variables);
            const subject = loginData.isSuspicious ?
                '⚠️ Suspicious Login Detected' :
                'New Login to Your Account';

            return await this.sendEmail(loginData.email, subject, html);
        } catch (error) {
            console.error('Error sending login alert:', error);
            return { success: false, error: error.message };
        }
    }

    // Admin notification email
    async sendAdminNotification(adminEmail, notificationData) {
        try {
            const variables = {
                notificationType: notificationData.type,
                notificationTitle: notificationData.title,
                priorityLevel: notificationData.priority || 'Medium',
                priorityClass: notificationData.priority === 'High' ? 'high' :
                              notificationData.priority === 'Low' ? 'low' : 'medium',
                timestamp: new Date().toLocaleString(),
                eventDescription: notificationData.description,
                eventDetails: notificationData.details || 'No additional details',
                affectedComponents: notificationData.components || 'System',
                notificationId: notificationData.id || 'N/A',
                sourceIp: notificationData.sourceIp || 'System',
                userAgent: notificationData.userAgent || 'System',
                requestId: notificationData.requestId || 'N/A',
                environment: process.env.NODE_ENV || 'Development',
                actionRequired: notificationData.actionRequired || false,
                actionDescription: notificationData.actionDescription || '',
                actionItems: notificationData.actionItems || [],
                adminDashboardUrl: `${process.env.APP_URL}/admin`,
                urgentSupportEmail: process.env.URGENT_SUPPORT_EMAIL,
                supportPhone: process.env.SUPPORT_PHONE
            };

            const html = this.emailManager.processTemplate('admin-notification-email', variables);
            return await this.sendEmail(adminEmail, `System Notification: ${notificationData.title}`, html);
        } catch (error) {
            console.error('Error sending admin notification:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = EmailService;
