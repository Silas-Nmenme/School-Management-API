# Email Service - Implementation Examples

## How to Send Emails in Controllers

### Pattern 1: Send Welcome Email (on Student Registration)

```javascript
const { getEmailService } = require('../emails/service.js');

const registerStudent = async (req, res) => {
    // ... validation and student creation ...
    
    const newStudent = new Student({
        Fistname: 'John',
        Lastname: 'Doe',
        email: 'john@example.com',
        // ... other fields
    });
    
    await newStudent.save();
    
    // Send welcome email (NON-BLOCKING)
    try {
        const emailService = getEmailService();
        emailService.sendWelcomeEmail(newStudent, password).then(result => {
            if (result.success) {
                console.log(`✓ Welcome email sent to: ${newStudent.email}`);
            } else {
                console.error(`✗ Failed to send welcome email:`, result.error);
            }
        }).catch(emailError => {
            console.error("✗ Error sending welcome email:", emailError.message || emailError);
        });
    } catch (emailInitError) {
        console.error("✗ Email service not available:", emailInitError.message);
    }
    
    // Send response immediately (don't wait for email)
    res.status(201).json({ 
        message: "Student registered successfully",
        studentId: newStudent._id 
    });
};
```

### Pattern 2: Send Login Alert (on Student Login)

```javascript
const loginStudent = async (req, res) => {
    // ... authentication logic ...
    
    const loginData = {
        email: student.email,
        loginTime: new Date().toLocaleString(),
        ip: req.ip || 'Unknown',
        location: req.ip || 'Unknown',
        deviceInfo: 'Windows 10 (Desktop)',
        browserInfo: 'Chrome 120',
        sessionId: req.sessionID || 'N/A',
        authMethod: 'Password',
        isSuspicious: false,
        riskLevel: 'Low'
    };
    
    // Send login alert (NON-BLOCKING)
    try {
        const emailService = getEmailService();
        emailService.sendLoginAlert(loginData).then(result => {
            if (result.success) {
                console.log(`✓ Login alert email sent to: ${loginData.email}`);
            } else {
                console.error(`✗ Failed to send login alert:`, result.error);
            }
        }).catch(emailError => {
            console.error("✗ Error sending login alert:", emailError.message || emailError);
        });
    } catch (emailInitError) {
        console.error("✗ Email service not available:", emailInitError.message);
    }
    
    // Send response immediately
    res.status(200).json({ 
        message: "Login successful",
        token: token
    });
};
```

### Pattern 3: Send OTP Email (Forget Password)

```javascript
const forgetPassword = async (req, res) => {
    const { email } = req.body;
    
    // ... find student ...
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    student.otp = otp;
    await student.save();
    
    // Send OTP email (NON-BLOCKING)
    try {
        const emailService = getEmailService();
        emailService.sendOtpEmail(student, otp).then(result => {
            if (result.success) {
                console.log(`✓ OTP email sent to: ${student.email}`);
            } else {
                console.error(`✗ Failed to send OTP:`, result.error);
            }
        }).catch(emailError => {
            console.error("✗ Error sending OTP:", emailError.message || emailError);
        });
    } catch (emailInitError) {
        console.error("✗ Email service not available:", emailInitError.message);
    }
    
    res.status(200).json({ 
        message: "OTP sent to your email"
    });
};
```

### Pattern 4: Send Simple HTML Email (Contact Form)

```javascript
const createContact = async (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // ... save contact to database ...
    
    // Send admin notification (NON-BLOCKING)
    try {
        const emailService = getEmailService();
        emailService.sendEmail(
            process.env.ADMIN_EMAIL || 'admin@example.com',
            `New Contact Message from ${name}`,
            `<h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>`
        ).then(result => {
            if (result.success) {
                console.log(`✓ Contact notification sent to admin`);
            } else {
                console.error(`✗ Failed to send contact notification:`, result.error);
            }
        }).catch(emailError => {
            console.error("✗ Error sending notification:", emailError.message || emailError);
        });
    } catch (emailInitError) {
        console.error("✗ Email service not available:", emailInitError.message);
    }
    
    res.status(201).json({ 
        success: true,
        message: "Message sent successfully"
    });
};
```

### Pattern 5: Send Template Email with Custom Variables

```javascript
const promoteStudentToAdmin = async (req, res) => {
    const student = await Student.findById(req.params.studentId);
    
    student.isAdmin = true;
    await student.save();
    
    // Send admin promotion email (NON-BLOCKING)
    try {
        const emailService = getEmailService();
        emailService.sendAdminPromotionEmail(student).then(result => {
            if (result.success) {
                console.log(`✓ Admin promotion email sent to: ${student.email}`);
            } else {
                console.error(`✗ Failed to send promotion email:`, result.error);
            }
        }).catch(emailError => {
            console.error("✗ Error sending promotion email:", emailError.message || emailError);
        });
    } catch (emailInitError) {
        console.error("✗ Email service not available:", emailInitError.message);
    }
    
    res.status(200).json({ 
        message: "Student promoted to admin",
        student: student
    });
};
```

### Pattern 6: Send Course Registration Email

```javascript
const registerForCourse = async (req, res) => {
    const student = await Student.findById(req.student.id);
    const course = await Course.findById(req.body.courseId);
    
    // ... enrollment logic ...
    
    // Send course registration email (NON-BLOCKING)
    try {
        const emailService = getEmailService();
        emailService.sendCourseRegistrationEmail(student, course).then(result => {
            if (result.success) {
                console.log(`✓ Course registration email sent to: ${student.email}`);
            } else {
                console.error(`✗ Failed to send course email:`, result.error);
            }
        }).catch(emailError => {
            console.error("✗ Error sending course email:", emailError.message || emailError);
        });
    } catch (emailInitError) {
        console.error("✗ Email service not available:", emailInitError.message);
    }
    
    res.status(200).json({ 
        message: "Successfully registered for the course"
    });
};
```

## Email Service Methods Reference

### Available Methods

| Method | Parameters | Use Case |
|--------|-----------|----------|
| `sendEmail()` | `(to, subject, html)` | Send custom HTML email |
| `sendTemplateEmail()` | `(to, subject, templateName, variables)` | Send template-based email |
| `sendWelcomeEmail()` | `(studentData, password)` | Student registration |
| `sendLoginAlert()` | `(loginData)` | Login notification |
| `sendOtpEmail()` | `(studentData, otp)` | OTP verification |
| `sendPasswordResetEmail()` | `(studentData)` | Password reset confirmation |
| `sendAdminPromotionEmail()` | `(studentData)` | Admin promotion notification |
| `sendApplicationNotificationEmail()` | `(email, applicationData)` | Application status |
| `sendVisitConfirmationEmail()` | `(visitorData, visitData)` | Visit booking confirmation |
| `sendCourseRegistrationEmail()` | `(studentData, courseData)` | Course enrollment |

## Variable Template Reference

### Student Variables
```javascript
{
    FIRSTNAME: 'John',           // studentData.Fistname
    LASTNAME: 'Doe',             // studentData.Lastname
    EMAIL: 'john@example.com',   // studentData.email
    STUDENT_ID: 'STU123456',     // studentData.studentId
    AGE: '20',                   // studentData.age
    PHONE: '+1234567890',        // studentData.phone
}
```

### Login Alert Variables
```javascript
{
    EMAIL: 'john@example.com',
    LOGIN_TIME: '2/13/2026, 10:30:45 AM',
    IP_ADDRESS: '192.168.1.100',
    LOCATION: 'Unknown',
    DEVICE_INFO: 'Windows 10 (Desktop)',
    BROWSER_INFO: 'Chrome 120',
    SECURITY_STATUS: 'Normal',
    RISK_LEVEL: 'Low'
}
```

### OTP Variables
```javascript
{
    FIRSTNAME: 'John',
    EMAIL: 'john@example.com',
    OTP: '123456',
    REQUEST_TIME: '2/13/2026, 10:30:45 AM',
    OTP_EXPIRY: '10 minutes'
}
```

## Environment Variables Needed

```dotenv
# Gmail Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Application URLs
APP_URL=https://app.example.com
FRONTEND_URL=https://frontend.example.com

# Support Contacts
SUPPORT_EMAIL=support@example.com
SUPPORT_PHONE=+1-234-567-8900
ADMIN_EMAIL=admin@example.com
```

## Error Handling Best Practices

Always use the `try-catch` and `.then().catch()` pattern:

```javascript
try {
    const emailService = getEmailService();
    emailService.sendXxxEmail(data).then(result => {
        if (result.success) {
            console.log(`✓ Email sent successfully`);
            // Do additional success logging
        } else {
            console.error(`✗ Email failed:`, result.error);
            // Log failure but don't throw
        }
    }).catch(emailError => {
        console.error(`✗ Email error:`, emailError.message);
        // Handle unexpected errors
    });
} catch (emailInitError) {
    console.error(`✗ Service unavailable:`, emailInitError.message);
    // Handle service initialization failure
}

// Always respond to client immediately
res.status(200).json({ message: "Request processed" });
```

## Testing Emails Locally

Use the test endpoint to verify gmail configuration:

```bash
curl -X POST http://localhost:3000/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test@gmail.com"}'
```

Expected response:
```json
{
  "message": "Test email sent",
  "result": {
    "success": true,
    "messageId": "<...>"
  }
}
```

Check your server logs for:
```
✓ Email sent to your-test@gmail.com, messageId: <...>
```
