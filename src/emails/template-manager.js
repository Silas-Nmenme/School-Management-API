/**
 * Email Template Manager
 * Handles loading and processing email templates with variable substitution
 */

const fs = require('fs');
const path = require('path');

class TemplateManager {
    constructor() {
        this.templatesDir = path.join(__dirname, 'templates');
        this.templates = new Map();
        this.loadTemplates();
    }

    /**
     * Load all email templates from the templates directory
     */
    loadTemplates() {
        const templateFiles = [
            'welcome-email.html',
            'login-alert-email.html',
            'otp-verification-email.html',
            'password-reset-confirmation.html',
            'admin-promotion-email.html',
            'admin-notification-email.html',
            'admin-registration-email.html',
            'staff-welcome-email.html',
            'account-deletion-email.html',
            'application-notification-email.html',
            'course-deletion-email.html',
            'course-update-email.html',
            'settings-update-email.html',
            'visit-confirmation-email.html',
            'visit-notification-email.html',
            'visit-status-update-email.html'
        ];

        templateFiles.forEach(file => {
            try {
                const templatePath = path.join(this.templatesDir, file);
                if (fs.existsSync(templatePath)) {
                    const templateContent = fs.readFileSync(templatePath, 'utf8');
                    const templateName = path.basename(file, '.html');
                    this.templates.set(templateName, templateContent);
                    console.log(`✓ Loaded template: ${templateName}`);
                }
            } catch (error) {
                console.error(`✗ Error loading template ${file}:`, error.message);
            }
        });

        if (this.templates.size === 0) {
            console.warn('⚠ No email templates loaded');
        }
    }

    /**
     * Get a template by name
     * @param {string} templateName - Name of the template (without .html)
     * @returns {string} Template content
     */
    getTemplate(templateName) {
        return this.templates.get(templateName);
    }

    /**
     * Process a template with variable replacement
     * @param {string} templateName - Name of the template
     * @param {Object} variables - Variables to replace in template
     * @returns {string} Processed HTML
     */
    processTemplate(templateName, variables = {}) {
        const template = this.getTemplate(templateName);
        if (!template) {
            console.warn(`⚠ Template '${templateName}' not found`);
            return null;
        }

        let processedTemplate = template;
        
        // Replace all variables in format {{VARIABLE_NAME}}
        Object.entries(variables).forEach(([key, value]) => {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
            processedTemplate = processedTemplate.replace(regex, value || '');
        });

        return processedTemplate;
    }

    /**
     * Get all available templates
     * @returns {Array} Array of template names
     */
    getAvailableTemplates() {
        return Array.from(this.templates.keys());
    }
}

module.exports = TemplateManager;
