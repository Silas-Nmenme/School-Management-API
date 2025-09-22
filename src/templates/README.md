# Email Templates for Student Management System

This directory contains professionally designed HTML email templates for the Student Management System API. These templates are responsive, accessible, and optimized for various email clients.

## 📧 Available Templates

### 1. **Welcome Email** (`welcome-email.html`)
Sent to new students upon successful registration.
- **Purpose**: Welcome new users and provide account details
- **Key Features**: Account information, security tips, login button

### 2. **OTP Verification Email** (`otp-verification-email.html`)
Sent during password reset process.
- **Purpose**: Deliver one-time password for verification
- **Key Features**: Prominent OTP display, security warnings, expiration notice

### 3. **Password Reset Confirmation** (`password-reset-confirmation.html`)
Sent after successful password reset.
- **Purpose**: Confirm password change and provide security information
- **Key Features**: Success confirmation, security tips, next steps

### 4. **Admin Promotion Email** (`admin-promotion-email.html`)
Sent when a student is granted admin privileges.
- **Purpose**: Notify user of admin access and responsibilities
- **Key Features**: Privilege list, responsibilities, admin dashboard access

### 5. **Admin Notification Email** (`admin-notification-email.html`)
Sent to administrators for system events and alerts.
- **Purpose**: Notify admins of system events requiring attention
- **Key Features**: Event details, priority levels, action items

### 6. **Account Deletion Email** (`account-deletion-email.html`)
Sent when an account is permanently deleted.
- **Purpose**: Confirm account deletion and provide information
- **Key Features**: Deletion details, data retention info, support contacts

### 7. **Login Alert Email** (`login-alert-email.html`)
Sent for security monitoring of login activities.
- **Purpose**: Alert users of new login sessions
- **Key Features**: Login details, security status, suspicious activity detection

## 🛠️ Usage

### Basic Usage with EmailTemplateManager

```javascript
const { EmailTemplateManager } = require('./src/templates/email-templates');

// Initialize the template manager
const emailManager = new EmailTemplateManager();

// Process a welcome email
const welcomeEmail = emailManager.processTemplate('welcome-email', {
    firstname: 'John',
    lastname: 'Doe',
    studentId: 'STU123456789',
    email: 'john.doe@example.com',
    registrationDate: '2024-01-15',
    loginUrl: 'https://yourapp.com/login',
    supportEmail: 'support@yourapp.com',
    supportPhone: '+1-234-567-8900'
});

// Validate template variables
const validation = emailManager.validateTemplateVariables('welcome-email', variables);
if (!validation.isValid) {
    console.log('Missing variables:', validation.missingVariables);
}
```

### Template Variables

All templates support dynamic variable replacement using `{{VARIABLE_NAME}}` syntax. See `email-templates.js` for a complete list of available variables.

#### Common Variables
- `{{FIRSTNAME}}` - Student's first name
- `{{LASTNAME}}` - Student's last name
- `{{EMAIL}}` - Student's email address
- `{{STUDENT_ID}}` - Unique student identifier
- `{{SUPPORT_EMAIL}}` - Support contact email
- `{{SUPPORT_PHONE}}` - Support contact phone

#### Security Variables
- `{{OTP}}` - One-time password
- `{{IP_ADDRESS}}` - Request IP address
- `{{LOGIN_TIME}}` - Login timestamp
- `{{SESSION_ID}}` - Session identifier

## 🎨 Template Features

### Design Features
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern Styling**: Clean, professional appearance with CSS gradients
- **Accessibility**: Proper semantic HTML and ARIA attributes
- **Email Client Compatibility**: Tested with major email clients
- **Inline CSS**: All styles are inline for maximum compatibility

### Security Features
- **Visual Security Indicators**: Color-coded security levels
- **Clear Warnings**: Prominent security notices and tips
- **Action Buttons**: Clear calls-to-action for security steps
- **Context Information**: Detailed event and login information

### Interactive Elements
- **Action Buttons**: Direct links to relevant pages
- **Visual Hierarchy**: Clear information organization
- **Color Coding**: Priority and status indicators
- **Icons**: Visual elements for better understanding

## 📋 Integration Guide

### 1. Setup Email Service
```javascript
// Example with Nodemailer
const nodemailer = require('nodemailer');
const { EmailTemplateManager } = require('./src/templates/email-templates');

const transporter = nodemailer.createTransporter({
    host: 'your-smtp-host',
    port: 587,
    secure: false,
    auth: {
        user: 'your-email@domain.com',
        pass: 'your-password'
    }
});

const emailManager = new EmailTemplateManager();
```

### 2. Send Emails
```javascript
// Send welcome email
async function sendWelcomeEmail(studentData) {
    try {
        const html = emailManager.processTemplate('welcome-email', {
            firstname: studentData.Fistname,
            lastname: studentData.Lastname,
            studentId: studentData.studentId,
            email: studentData.email,
            registrationDate: new Date().toLocaleDateString(),
            loginUrl: process.env.LOGIN_URL,
            supportEmail: process.env.SUPPORT_EMAIL,
            supportPhone: process.env.SUPPORT_PHONE
        });

        await transporter.sendMail({
            from: '"Student Management System" <noreply@yourapp.com>',
            to: studentData.email,
            subject: 'Welcome to Student Management System!',
            html: html
        });
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
}
```

### 3. Handle Security Events
```javascript
// Send login alert
async function sendLoginAlert(loginData) {
    const html = emailManager.processTemplate('login-alert-email', {
        email: loginData.email,
        loginTime: new Date().toISOString(),
        ipAddress: loginData.ip,
        location: loginData.location,
        deviceInfo: loginData.device,
        securityStatus: 'Normal',
        riskLevel: 'Low'
    });

    await transporter.sendMail({
        from: '"Security Alert" <security@yourapp.com>',
        to: loginData.email,
        subject: 'New Login to Your Account',
        html: html
    });
}
```

## 🔧 Customization

### Adding New Templates
1. Create a new `.html` file in this directory
2. Use the existing templates as reference for structure
3. Add the template name to `templateFiles` array in `email-templates.js`
4. Define required variables in the `templateRequirements` object

### Modifying Existing Templates
1. Edit the HTML files directly
2. Maintain the variable replacement syntax `{{VARIABLE_NAME}}`
3. Test with different email clients
4. Ensure responsive design is maintained

### Styling Guidelines
- Use inline CSS for maximum compatibility
- Include fallback fonts
- Test with dark mode if applicable
- Ensure proper contrast ratios
- Use semantic HTML elements

## 🧪 Testing

### Template Testing
```javascript
// Test template processing
const testVariables = {
    firstname: 'Test',
    lastname: 'User',
    email: 'test@example.com',
    studentId: 'TEST123'
};

const html = emailManager.processTemplate('welcome-email', testVariables);
console.log(html);
```

### Email Client Testing
- Test with major email clients (Gmail, Outlook, Apple Mail)
- Verify responsive design on mobile devices
- Check dark mode compatibility
- Ensure all links work properly

## 📊 Best Practices

### Security
- Never include sensitive information in email templates
- Use HTTPS URLs for all links
- Implement proper rate limiting for email sending
- Monitor for suspicious email activity

### Performance
- Optimize images and use appropriate formats
- Minimize CSS for faster loading
- Use efficient variable replacement
- Cache compiled templates when possible

### User Experience
- Keep emails concise and focused
- Use clear, actionable language
- Provide multiple contact methods
- Include unsubscribe options where appropriate

## 🚨 Troubleshooting

### Common Issues
1. **Variables not replacing**: Check variable name casing and spelling
2. **Emails not rendering**: Verify inline CSS and HTML structure
3. **Mobile display issues**: Test responsive design thoroughly
4. **Email client compatibility**: Use email testing services

### Debug Mode
Enable debug logging to troubleshoot template issues:
```javascript
const emailManager = new EmailTemplateManager();
emailManager.debug = true; // Enable debug logging
```

## 📞 Support

For issues with email templates or integration:
- Check the template validation results
- Review email client compatibility
- Test with sample data
- Contact development team for template customization

---

**Note**: These templates are designed to work with the Student Management System API. Customize them according to your specific requirements and branding guidelines.
