/**
 * Centralized Email Service Instance
 * Creates a singleton instance of EmailService to avoid re-instantiation
 * and ensure environment variables are validated once at startup
 */

let emailServiceInstance = null;
let initializationError = null;

function getEmailService() {
    if (emailServiceInstance) {
        return emailServiceInstance;
    }

    if (initializationError) {
        throw initializationError;
    }

    try {
        const EmailService = require('./email-service');
        emailServiceInstance = new EmailService();
        console.log('✓ Email service initialized successfully');
        return emailServiceInstance;
    } catch (error) {
        initializationError = error;
        console.error('✗ Failed to initialize email service:', error.message);
        throw error;
    }
}

module.exports = {
    getEmailService
};
