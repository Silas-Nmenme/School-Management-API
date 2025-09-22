const Student = require("../models/student.schema.js");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const uuid = require("uuid").v4;
const token = uuid(); // Generate a unique token for the student
const EmailService = require("../templates/email-service");
const emailService = new EmailService();

const generateStudentId = () => {
    return 'STU' + Date.now() + Math.floor(Math.random() * 1000);
};

const addStudent = async (req, res) => {
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


//Edit a student
const editStudent = async (req, res) => {
    const { studentId } = req.params;
    const { Fistname, Lastname, email, age, phone } = req.body || {};
    const id = req.student.id;
    try {
        const admin = await Student.findById(id);
        if (admin.isAdmin !== true) {
            return res.status(403).json({ message: "Only admins can edit student" });
        }
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        // Update student details
        student.Fistname = Fistname || student.Fistname;
        student.Lastname = Lastname || student.Lastname;
        student.email = email || student.email;
        student.age = age || student.age;
        student.phone = phone || student.phone;
        await student.save();
        return res.status(200).json({ message: "Student updated successfully" });
    }
    catch (error) {
        console.error("Error editing student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteStudent = async (req, res) => {
    const  {studentId } = req.params;
    const id = req.student.id;
    try {
        const student = await Student.findById(id);
        if (student.isAdmin !== true) {
            return res.status(403).json({ message: "Only admin can delete student" });
        }
        const deletedStudent = await Student.findByIdAndDelete(studentId);
        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Send account deletion email (non-blocking)
        emailService.sendAccountDeletionEmail(deletedStudent, {
            method: 'Admin Deletion',
            requestedBy: req.user?.email || 'Admin'
        }).catch(emailError => {
            console.error("Failed to send account deletion email:", emailError.message);
            // Don't fail the deletion if email fails
        });

        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all students
const getAllStudents = async (_req, res) => {
    try {
        const students = await Student.find();
        return res.status(200).json({ students});
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    addStudent,
    editStudent,
    deleteStudent,
    getAllStudents
};
