const Student = require("../models/student.schema.js");


//Edit a student
const editStudent = async (req, res) => {
    const { studentId } = req.params;
    const { Fistname, Lastname, email, age, phone } = req.body;
    const id = req.student.id;
    try {
        const admin = await Student.findById(id);
        if (admin.isAdmin !== true) {
            return res.status(403).json({ message: "Only admin can edit student" });
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
    const { studentId } = req.params;
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
    editStudent,
    deleteStudent,
    getAllStudents
};