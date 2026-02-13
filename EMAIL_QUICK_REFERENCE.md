# Email Service - Quick Reference Card

## TL;DR - How to Send Emails

### Import the Service
```javascript
const { getEmailService } = require('../emails/service.js');
```

### Send an Email
```javascript
const emailService = getEmailService();

// Method 1: Simple Email
emailService.sendEmail(
  'recipient@example.com',
  'Subject Line',
  '<h1>Hello</h1><p>Message</p>'
).then(result => {
  if (result.success) console.log('✓ Sent');
  else console.error('✗ Failed:', result.error);
}).catch(err => console.error('✗ Error:', err.message));

// Method 2: Welcome Email (Student)
emailService.sendWelcomeEmail(studentData, password);

// Method 3: Login Alert
emailService.sendLoginAlert(loginData);

// Method 4: OTP Email
emailService.sendOtpEmail(studentData, otp);

// Method 5: Password Reset
emailService.sendPasswordResetEmail(studentData);

// Method 6: Admin Promotion
emailService.sendAdminPromotionEmail(studentData);

// Method 7: Course Registration
emailService.sendCourseRegistrationEmail(studentData, courseData);

// Method 8: Application Notification
emailService.sendApplicationNotificationEmail(email, applicationData);

// Method 9: Visit Confirmation
emailService.sendVisitConfirmationEmail(visitorData, visitData);
```

## Response Format

All methods return or resolve with:
```javascript
{
  success: true,          // true if sent, false if failed
  messageId: "123...",    // Unique message ID from Gmail
  error: "Error message"  // Only present if success is false
}
```

## What Gets Logged

When email is sent successfully:
```
✓ Email sent to john@example.com, messageId: ...
```

When email fails:
```
✗ Failed to send email to john@example.com: Error message
✗ Error sending email: Error details
✗ Email service not available: Error details
```

## Email Templates Available

1. `welcome-email` - Student registration
2. `login-alert-email` - Login notification
3. `otp-verification-email` - OTP for password reset
4. `password-reset-confirmation` - Password reset success
5. `admin-promotion-email` - Promotion to admin
6. `admin-notification-email` - Admin alerts
7. `admin-registration-email` - New admin account
8. `staff-welcome-email` - Staff onboarding
9. `account-deletion-email` - Account deletion confirmation
10. `application-notification-email` - Application status
11. `course-deletion-email` - Course removed
12. `course-update-email` - Course changes
13. `settings-update-email` - System settings changed
14. `visit-confirmation-email` - Visit booking confirmed
15. `visit-notification-email` - Visit admin notification
16. `visit-status-update-email` - Visit status changed

## Required .env Variables

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=16-character-app-password
APP_URL=https://yourapp.com
SUPPORT_EMAIL=support@example.com
SUPPORT_PHONE=+1-234-567-8900
ADMIN_EMAIL=admin@example.com
```

## Common Data Objects

### studentData
```javascript
{
  Fistname: 'John',
  Lastname: 'Doe',
  email: 'john@example.com',
  age: 20,
  phone: '+1234567890',
  studentId: 'STU123456'
}
```

### loginData
```javascript
{
  email: 'john@example.com',
  loginTime: '2/13/2026, 10:30:45 AM',
  ip: '192.168.1.100',
  location: 'City, Country',
  deviceInfo: 'Windows 10 (Desktop)',
  browserInfo: 'Chrome 120',
  isSuspicious: false,
  riskLevel: 'Low'
}
```

### courseData
```javascript
{
  courseId: 'CS101',
  name: 'Introduction to Computer Science',
  description: 'Learn the basics...'
}
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Emails not sending | Check EMAIL_USER and EMAIL_PASS in .env |
| Gmail blocking | Use App Password, not regular Gmail password |
| Template not found | Verify HTML file exists in `/src/emails/templates/` |
| Service not initialized | Check server logs for "✗ Email service initialization failed" |
| Emails delayed | They are sent async, this is normal - don't wait for them |

## Testing

```bash
# Test email endpoint
curl -X POST http://localhost:3000/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Full Example in Controller

```javascript
const registerStudent = async (req, res) => {
    try {
        // Create student
        const newStudent = new Student({...});
        await newStudent.save();
        
        // Send email (non-blocking)
        try {
            const emailService = getEmailService();
            emailService.sendWelcomeEmail(newStudent, password)
                .then(result => {
                    console.log(result.success 
                        ? `✓ Welcome email sent`
                        : `✗ Failed to send: ${result.error}`);
                })
                .catch(err => console.error(`✗ Error: ${err.message}`));
        } catch (e) {
            console.error(`✗ Email service unavailable: ${e.message}`);
        }
        
        // Respond immediately (email is async)
        res.status(201).json({ success: true, studentId: newStudent._id });
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false });
    }
};
```

## Key Points to Remember

✓ Always use **non-blocking** email (don't await)  
✓ Always log success and errors  
✓ Email failures should NOT break the main request  
✓ Check server logs to see if emails are actually sending  
✓ Use `sendEmail()` for custom content  
✓ Use specific methods for standard emails  
✓ All errors are caught and logged automatically  
✓ Service is a singleton - only one instance  

## File Structure

```
src/emails/
├── service.js                # Main email service
├── template-manager.js       # Template loader
└── templates/
    ├── welcome-email.html
    ├── login-alert-email.html
    ├── otp-verification-email.html
    └── ... (13 more templates)
```

Old files to delete (in `/src/templates/`):
- ~~email-service.js~~
- ~~email-templates.js~~
- ~~email-service-instance.js~~
