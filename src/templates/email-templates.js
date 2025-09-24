
/**
 * Email Templates Utility
 * Handles email template management and variable replacement for the Student Management System
 */

const fs = require('fs');
const path = require('path');

class EmailTemplateManager {
    constructor() {
        this.templatesDir = path.join(__dirname);
        this.templates = new Map();
        this.loadTemplates();
    }

    /**
     * Load all email templates from the templates directory
     */
    loadTemplates() {
        const templateFiles = [
            'welcome-email.html',
            'staff-welcome-email.html',
            'otp-verification-email.html',
            'password-reset-confirmation.html',
            'admin-promotion-email.html',
            'admin-notification-email.html',
            'account-deletion-email.html',
            'login-alert-email.html'
        ];

        templateFiles.forEach(file => {
            try {
                const templatePath = path.join(this.templatesDir, file);
                const templateContent = fs.readFileSync(templatePath, 'utf8');
                const templateName = path.basename(file, '.html');
                this.templates.set(templateName, templateContent);
            } catch (error) {
                console.error(`Error loading template ${file}:`, error.message);
            }
        });
    }

    /**
     * Get a template by name
     * @param {string} templateName - Name of the template (without .html extension)
     * @returns {string} Template content
     */
    getTemplate(templateName) {
        return this.templates.get(templateName) || '';
    }

    /**
     * Replace variables in a template
     * @param {string} template - Template string with variables
     * @param {Object} variables - Object containing variable replacements
     * @returns {string} Template with replaced variables
     */
    replaceVariables(template, variables) {
        let result = template;

        // Handle both {{VARIABLE}} and {{variable}} formats
        Object.keys(variables).forEach(key => {
            const upperKey = key.toUpperCase();
            const originalKey = key;

            // Replace uppercase version
            result = result.replace(new RegExp(`{{${upperKey}}}`, 'g'), variables[key] || '');

            // Replace original case version
            result = result.replace(new RegExp(`{{${originalKey}}}`, 'g'), variables[key] || '');
        });

        return result;
    }

    /**
     * Process a template with variables
     * @param {string} templateName - Name of the template
     * @param {Object} variables - Variables to replace in the template
     * @returns {string} Processed template
     */
    processTemplate(templateName, variables = {}) {
        const template = this.getTemplate(templateName);
        if (!template) {
            throw new Error(`Template '${templateName}' not found`);
        }

        return this.replaceVariables(template, variables);
    }

    /**
     * Get all available template names
     * @returns {Array} Array of template names
     */
    getAvailableTemplates() {
        return Array.from(this.templates.keys());
    }

    /**
     * Validate required variables for a template
     * @param {string} templateName - Name of the template
     * @param {Object} variables - Variables provided
     * @returns {Object} Validation result with missing variables
     */
    validateTemplateVariables(templateName, variables = {}) {
        const template = this.getTemplate(templateName);
        const requiredVariables = [];
        const optionalVariables = [];

        // Extract all variables from template
        const variableMatches = template.match(/\{\{([^}]+)\}\}/g) || [];
        const allVariables = variableMatches.map(match => match.replace(/\{\{|\}\}/g, ''));

        // Common required variables for all templates
        const commonRequired = ['SUPPORT_EMAIL', 'SUPPORT_PHONE'];

        // Template-specific required variables
        const templateRequirements = {
            'welcome-email': ['FIRSTNAME', 'LASTNAME', 'STUDENT_ID', 'EMAIL', 'REGISTRATION_DATE'],
            'staff-welcome-email': ['FIRSTNAME', 'LASTNAME', 'STAFF_ID', 'EMAIL', 'ROLE', 'DEPARTMENT', 'REGISTRATION_DATE'],
            'otp-verification-email': ['FIRSTNAME', 'EMAIL', 'OTP', 'REQUEST_TIME'],
            'password-reset-confirmation': ['FIRSTNAME', 'LASTNAME', 'EMAIL', 'RESET_TIME'],
            'admin-promotion-email': ['FIRSTNAME', 'LASTNAME', 'STUDENT_ID', 'EMAIL', 'PROMOTION_DATE'],
            'admin-notification-email': ['NOTIFICATION_TYPE', 'TIMESTAMP', 'EVENT_DESCRIPTION'],
            'account-deletion-email': ['FIRSTNAME', 'LASTNAME', 'STUDENT_ID', 'EMAIL', 'DELETION_DATE'],
            'login-alert-email': ['EMAIL', 'LOGIN_TIME', 'IP_ADDRESS', 'LOCATION']
        };

        const required = [
            ...commonRequired,
            ...(templateRequirements[templateName] || [])
        ];

        const missing = required.filter(req => !variables.hasOwnProperty(req.toLowerCase()));

        return {
            isValid: missing.length === 0,
            missingVariables: missing,
            providedVariables: Object.keys(variables),
            allVariables: allVariables
        };
    }
}

// Common email variables and their descriptions
const EMAIL_VARIABLES = {
    // Personal Information
    FIRSTNAME: 'Person\'s first name',
    LASTNAME: 'Person\'s last name',
    EMAIL: 'Person\'s email address',
    STUDENT_ID: 'Unique student identifier',
    STAFF_ID: 'Unique staff identifier',
    AGE: 'Person\'s age',
    PHONE: 'Person\'s phone number',
    ROLE: 'Staff member\'s role/position',
    DEPARTMENT: 'Staff member\'s department',

    // System Information
    REGISTRATION_DATE: 'Date when student registered',
    LOGIN_URL: 'URL for student login page',
    ADMIN_DASHBOARD_URL: 'URL for admin dashboard',
    SUPPORT_URL: 'URL for support page',
    SECURITY_URL: 'URL for security settings',
    RESET_URL: 'URL for password reset page',

    // Security & Authentication
    OTP: 'One-time password for verification',
    TEMP_PASSWORD: 'Temporary password for new accounts',
    REQUEST_TIME: 'Time when request was made',
    RESET_TIME: 'Time when password was reset',
    LOGIN_TIME: 'Time when login occurred',
    IP_ADDRESS: 'IP address of the request',
    SESSION_ID: 'Unique session identifier',

    // Location & Device Information
    LOCATION: 'Geographic location of login',
    DEVICE_INFO: 'Device information',
    BROWSER_INFO: 'Browser information',
    USER_AGENT: 'User agent string',

    // Administrative Information
    PROMOTION_DATE: 'Date when admin privileges were granted',
    PROMOTED_BY: 'Who granted admin privileges',
    DELETION_DATE: 'Date when account was deleted',
    DELETION_METHOD: 'How the account was deleted',
    REQUESTED_BY: 'Who requested the deletion',

    // Notification Information
    NOTIFICATION_TYPE: 'Type of system notification',
    NOTIFICATION_TITLE: 'Title of the notification',
    PRIORITY_LEVEL: 'Priority level (High/Medium/Low)',
    PRIORITY_CLASS: 'CSS class for priority styling',
    TIMESTAMP: 'When the notification occurred',
    EVENT_DESCRIPTION: 'Description of the event',
    EVENT_DETAILS: 'Detailed event information',
    AFFECTED_COMPONENTS: 'System components affected',
    NOTIFICATION_ID: 'Unique notification identifier',
    SOURCE_IP: 'Source IP of the event',
    REQUEST_ID: 'Unique request identifier',

    // Action Information
    ACTION_REQUIRED: 'Whether action is required',
    ACTION_DESCRIPTION: 'Description of required action',
    ACTION_ITEMS: 'Array of specific action items',

    // Environment Information
    ENVIRONMENT: 'System environment (Production/Staging/Development)',

    // Support Information
    SUPPORT_EMAIL: 'General support email',
    ADMIN_SUPPORT_EMAIL: 'Admin-specific support email',
    URGENT_SUPPORT_EMAIL: 'Urgent support contact',
    SECURITY_EMAIL: 'Security team email',
    SUPPORT_PHONE: 'Support phone number',

    // Security Information
    SECURITY_STATUS: 'Security status of the login',
    RISK_LEVEL: 'Risk level assessment',
    AUTH_METHOD: 'Authentication method used',
    IS_SUSPICIOUS: 'Whether the activity is suspicious'
};

module.exports = {
    EmailTemplateManager,
    EMAIL_VARIABLES
};
