# Email Service System - Documentation

## Overview
The email service has been completely reorganized and refactored for better maintainability and reliability. The new structure separates concerns properly with dedicated modules for template management and email sending.

## New Folder Structure

```
src/
├── emails/
│   ├── service.js                 # Core email service with Nodemailer integration
│   ├── template-manager.js        # Email template loading and processing
│   └── templates/                 # Email HTML templates
│       ├── welcome-email.html
│       ├── login-alert-email.html
│       ├── otp-verification-email.html
│       ├── password-reset-confirmation.html
│       ├── admin-promotion-email.html
│       ├── admin-notification-email.html
│       ├── admin-registration-email.html
│       ├── staff-welcome-email.html
│       ├── account-deletion-email.html
│       ├── application-notification-email.html
│       ├── course-deletion-email.html
│       ├── course-update-email.html
│       ├── settings-update-email.html
│       ├── visit-confirmation-email.html
│       ├── visit-notification-email.html
│       └── visit-status-update-email.html
└── controller/
    ├── students.controller.js      # Updated to use new email service
    ├── admins.controller.js        # Updated to use new email service
    ├── contact.controller.js       # Updated to use new email service
    ├── applications.controller.js  # Updated to use new email service
    └── visit.controller.js         # Updated to use new email service
```

## Core Modules

### 1. `service.js` - Email Service

**Main Features:**
- Singleton pattern for consistent email service instance
- Nodemailer integration with Gmail SMTP
- Template-based email sending
- Comprehensive error logging with checkmarks (✓) and X marks (✗)
- Non-blocking email operations

**Available Methods:**

#### Send Simple Email
```javascript
const { getEmailService } = require('./src/emails/service.js');
const emailService = getEmailService();

await emailService.sendEmail(
  'recipient@example.com',
  'Subject',
  '<h1>Hello</h1>'
);
```

#### Send Welcome Email (Student Registration)
```javascript
await emailService.sendWelcomeEmail(studentData, password);
// studentData: { Fistname, Lastname, email, age, phone, studentId }
// password: temporary password to send
```

#### Send Login Alert
```javascript
await emailService.sendLoginAlert(loginData);
// loginData: { email, loginTime, ip, location, deviceInfo, browserInfo, ... }
```

#### Send OTP Verification Email
```javascript
await emailService.sendOtpEmail(studentData, otp);
// studentData: { Fistname, email, ... }
// otp: '123456'
```

#### Send Password Reset Confirmation
```javascript
await emailService.sendPasswordResetEmail(studentData);
```

#### Send Admin Promotion Email
```javascript
await emailService.sendAdminPromotionEmail(studentData);
```

#### Send Course Registration Email
```javascript
await emailService.sendCourseRegistrationEmail(studentData, courseData);
// courseData: { name, courseId, ... }
```

#### Send Application Notification Email
```javascript
await emailService.sendApplicationNotificationEmail(email, applicationData);
// applicationData: { id, status, submissionDate, ... }
```

#### Send Visit Confirmation Email
```javascript
await emailService.sendVisitConfirmationEmail(visitorData, visitData);
// visitData: { visitDate, visitTime, purpose, confirmationNumber }
```

### 2. `template-manager.js` - Template Manager

**Functions:**
- Loads all HTML templates from the `/templates` directory on initialization
- Provides template processing with variable substitution using `{{VARIABLE}}` syntax
- Returns list of available templates

**Usage:**
```javascript
const TemplateManager = require('./src/emails/template-manager.js');
const manager = new TemplateManager();

// Reset template with variables
const html = manager.processTemplate('welcome-email', {
  FIRSTNAME: 'John',
  LASTNAME: 'Doe',
  EMAIL: 'john@example.com'
});
```

## Environment Variables Required

```dotenv
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
APP_URL=https://bethelcollege.netlify.app
SUPPORT_EMAIL=support@example.com
SUPPORT_PHONE=+1-xxx-xxx-xxxx
ADMIN_EMAIL=admin@example.com
```

### Important: Gmail App Passwords

For Gmail, you need to:
1. Enable 2-Step Verification
2. Generate an App Password (not your regular Gmail password)
3. Use the 16-character app password in `EMAIL_PASS`

## Controller Integration

### Students Controller
- **registerStudent**: Sends welcome email with temporary credentials
- **loginStudent**: Sends login alert email with device/browser info
- **forgetPassword**: Sends OTP verification email
- **resetPassword**: Sends password reset confirmation email
- **makeAdmin**: Sends admin promotion email
- **registerForCourse**: Sends course registration confirmation email

### Admins Controller
- **registerStudent**: Sends welcome email
- **deleteStudent**: Sends account deletion confirmation email
- **registerStaff**: Sends staff welcome email
- **updateStaffPassword**: Sends password update notification
- **createCourse**: Sends course creation notification to admin
- **updateCourse**: Sends course update notification to admin
- **deleteCourse**: Sends course deletion notification to admin

### Contact Controller
- **createContact**: Sends contact notification email to admin

### Applications Controller
- **submitApplication**: Sends application notification to admin

### Visit Controller
- **createVisit**: Sends visit confirmation to visitor and notification to admin

## Error Handling

All email operations use the following pattern:

```javascript
try {
    const emailService = getEmailService();
    emailService.sendWelcomeEmail(student, password).then(result => {
        if (result.success) {
            console.log(`✓ Email sent to: ${student.email}`);
        } else {
            console.error(`✗ Failed to send email:`, result.error);
        }
    }).catch(emailError => {
        console.error("✗ Error sending email:", emailError.message || emailError);
    });
} catch (emailInitError) {
    console.error("✗ Email service not available:", emailInitError.message);
}
```

**Key Points:**
- Emails are sent **non-blocking** (don't delay API responses)
- All email errors are logged but don't cause API failures
- Service initialization errors are caught at startup
- Clear console logging with ✓ (success) and ✗ (failure) indicators

## Testing Email Service

### Test Email Endpoint
The app includes a test endpoint for debugging email issues:

```bash
POST http://localhost:3000/test-email
Body: { "email": "test@example.com" }
```

### Server Startup Verification
When you start the server, you should see:
```
✓ Loaded template: welcome-email
✓ Loaded template: login-alert-email
... (all templates)
✓ Email service initialized at startup
✓ Email transporter verified successfully
MongoDB connected successfully
Server is running on port 3000
```

## Troubleshooting

### Issue: Email service not initializing
**Solution**: Check your `EMAIL_USER` and `EMAIL_PASS` environment variables in `.env`

### Issue: Templates not loading
**Solution**: Verify all HTML files exist in `/src/emails/templates/` folder

### Issue: Emails not sent but no errors
**Solution**: Gmail may be blocking the connection. Enable "Less secure app access" or use an App Password

### Issue: Wrong variables in email template
**Solution**: Check template file contains correct `{{VARIABLE_NAME}}` placeholders matching what you're passing in the service

## Future Improvements

- [ ] Add retry mechanism for failed emails
- [ ] Implement email queue system
- [ ] Add email delivery tracking
- [ ] Support for multiple email providers (SendGrid, Mailgun, etc.)
- [ ] Email template versioning
- [ ] A/B testing support
