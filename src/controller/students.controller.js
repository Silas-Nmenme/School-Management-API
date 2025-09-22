const Student = require("../models/student.schema.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const uuid = require("uuid").v4;
const token = uuid(); // Generate a unique token for the student
const EmailService = require("../templates/email-service");
const emailService = new EmailService();

const generateStudentId = () => {
    return 'STU' + Date.now() + Math.floor(Math.random() * 1000);
};

const registerStudent = async (req, res) => {
       const { Fistname, Lastname, email, age, phone, password, confirmpassword } = req.body;
    // Validate required fields
    if (!Fistname || !Lastname || !email || !age || !phone || !password || !confirmpassword) {
        return res.status(400).json({ message: "All fields are required" });
    }
       const parsedAge = Number(age);
    if (isNaN(parsedAge) || parsedAge <= 0) {
        return res.status(400).json({ message: 'Age must be a positive number' });
    }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        // Check if the student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: "Student already exists" });
        }

        // Validate password match
        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const studentId = generateStudentId(); // Generate a unique student ID

        // Create a new student
         const newStudent = new Student({
        studentId,
        Fistname,
        Lastname,
        email,
        age: parsedAge,
        phone,
        password: hashedPassword,
        confirmpassword: hashedPassword,
        token: token
    });


        // Save the student to the database
        await newStudent.save();

        //Prepare registration details to return (excluding password)
        const registrationDetails = {
            studentId: newStudent.studentId,
            Fistname: newStudent.Fistname,
            Lastname: newStudent.Lastname,
            email: newStudent.email,
            age: newStudent.age,
            phone: newStudent.phone
        };

        res.status(201).json({ message: "Student registered successfully", registrationDetails });
        console.log("New student registered:", registrationDetails);

        // Send welcome email (non-blocking)
        emailService.sendWelcomeEmail(newStudent).catch(emailError => {
            console.error("Failed to send welcome email:", emailError.message);
            // Don't fail the registration if email fails
        });

        return newStudent;
};

const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find if student exists
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const payload = {
            email: student.email,
            id: student._id,
        }

        // Generate a new token
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION } // Token expiration time
        );
        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const makeAdmin = async (req, res) => {
    const { studentId } = req.params;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        student.isAdmin = true; // Assuming you have an isAdmin field in your student schema
        await student.save();

        // Send admin promotion email (non-blocking)
        emailService.sendAdminPromotionEmail(student, req.user?.email || 'System Administrator').catch(emailError => {
            console.error("Failed to send admin promotion email:", emailError.message);
            // Don't fail the promotion if email fails
        });

        return res.status(200).json({ message: "Student promoted to admin successfully", student });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // Validate required fields
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Find the student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Generate a 6 digit otp with math.random()
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        student.otp = otp; // Assuming you have an otp field in your student schema
        await student.save();

        // Send OTP email (non-blocking)
        emailService.sendOtpEmail(email, otp, student.Fistname).catch(emailError => {
            console.error("Failed to send OTP email:", emailError.message);
            // Don't fail the OTP generation if email fails
        });

        return res.status(200).json({ message: "OTP sent to your email", otp });
    }
    catch (error) {
        console.error("Error in forget password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
const verifyOtp = async (req, res) => {
    const {otp} = req.body;
    try{
        const student = await Student.findOne({
            otp: otp
        });
        if (!student) {
            return res.status(404).json({ message: "Invalid OTP" });
        }
        student.otpverified = true; // Assuming you have an otpverified field in your student schema
        await student.save();

        // OTP is valid, proceed with password reset
        return res.status(200).json({ message: "OTP verified successfully", studentId: student._id });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const resetPassword = async (req, res) => {
    const { confirmedPassword, newPassword } = req.body;
    const { studentId } = req.params;
    console.log(studentId)
    // Validate required fields
    if (!studentId || !newPassword) {
        return res.status(400).json({ message: "Student ID and new password are required" });
    }
    if (newPassword !== confirmedPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    try {
        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        if (student.otpverified !== true) {
            return res.status(400).json({ message: "OTP not verified" });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        student.password = hashedPassword;
        student.otpverified = false; // Reset OTP verification status
        await student.save();

        // Send password reset confirmation email (non-blocking)
        emailService.sendPasswordResetConfirmation(student).catch(emailError => {
            console.error("Failed to send password reset confirmation email:", emailError.message);
            // Don't fail the password reset if email fails
        });

        return res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const logoutStudent = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Find the student by email
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Optionally, clear the token field if you store it in the DB
        student.token = null;
        await student.save();

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out student:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getStudentCount = async (req, res) => {
    try {
        const count = await Student.countDocuments();
        return res.status(200).json({ totalStudents: count });
    } catch (error) {
        console.error("Error getting student count:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    registerStudent,
    loginStudent,
    makeAdmin,
    forgetPassword,
    verifyOtp,
    resetPassword,
    logoutStudent,
    getStudentCount
};
