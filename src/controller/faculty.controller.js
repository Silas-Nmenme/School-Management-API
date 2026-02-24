const Faculty = require("../models/faculty.schema.js");
const Department = require("../models/department.schema.js");

/**
 * Generate a unique faculty ID
 * Format: FAC{numeric sequence}
 */
const generateFacultyId = async () => {
  const count = await Faculty.countDocuments();
  return 'FAC' + String(count + 1).padStart(3, '0');
};

/**
 * Create a new Faculty
 */
const createFaculty = async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Faculty name is required" });
    }

    // Check if faculty with same name exists
    const existingFaculty = await Faculty.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingFaculty) {
      return res.status(400).json({ message: "Faculty with this name already exists" });
    }

    const facultyId = await generateFacultyId();

    const newFaculty = new Faculty({
      facultyId,
      name,
      description: description || '',
      icon: icon || '',
      order: order || 0
    });

    const savedFaculty = await newFaculty.save();

    res.status(201).json({
      message: "Faculty created successfully",
      faculty: savedFaculty
    });

    console.log("New faculty created:", {
      id: savedFaculty._id,
      facultyId: savedFaculty.facultyId,
      name: savedFaculty.name
    });

  } catch (error) {
    console.error("Error creating faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all Faculties
 */
const getAllFaculties = async (req, res) => {
  try {
    const faculties = await Faculty.find({ isActive: true }).sort({ order: 1, name: 1 });

    res.status(200).json({
      message: "Faculties retrieved successfully",
      totalFaculties: faculties.length,
      faculties
    });

    console.log(`Retrieved ${faculties.length} faculties`);

  } catch (error) {
    console.error("Error fetching faculties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get Faculty by ID
 */
const getFacultyById = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({
      message: "Faculty retrieved successfully",
      faculty
    });

  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get Faculty by Name
 */
const getFacultyByName = async (req, res) => {
  try {
    const { name } = req.params;

    const faculty = await Faculty.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    res.status(200).json({
      message: "Faculty retrieved successfully",
      faculty
    });

  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update Faculty
 */
const updateFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { name, description, icon, order, isActive } = req.body;

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Check if updating name to one that already exists
    if (name && name !== faculty.name) {
      const existingFaculty = await Faculty.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: facultyId }
      });
      
      if (existingFaculty) {
        return res.status(400).json({ message: "Faculty with this name already exists" });
      }
    }

    // Update fields
    if (name) faculty.name = name;
    if (description !== undefined) faculty.description = description;
    if (icon !== undefined) faculty.icon = icon;
    if (order !== undefined) faculty.order = order;
    if (isActive !== undefined) faculty.isActive = isActive;

    const updatedFaculty = await faculty.save();

    res.status(200).json({
      message: "Faculty updated successfully",
      faculty: updatedFaculty
    });

    console.log(`Faculty updated - ID: ${facultyId}, Name: ${updatedFaculty.name}`);

  } catch (error) {
    console.error("Error updating faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete Faculty
 */
const deleteFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Check if there are departments associated with this faculty
    const departmentCount = await Department.countDocuments({ faculty: facultyId });
    
    if (departmentCount > 0) {
      return res.status(400).json({ 
        message: `Cannot delete faculty. It has ${departmentCount} associated department(s). Please delete the departments first.`
      });
    }

    await Faculty.findByIdAndDelete(facultyId);

    res.status(200).json({ message: "Faculty deleted successfully" });

    console.log(`Faculty deleted - ID: ${facultyId}`);

  } catch (error) {
    console.error("Error deleting faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get Faculty with Departments
 */
const getFacultyWithDepartments = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const departments = await Department.find({ 
      faculty: facultyId,
      isActive: true 
    }).sort({ order: 1, name: 1 });

    res.status(200).json({
      message: "Faculty with departments retrieved successfully",
      faculty: {
        ...faculty.toObject(),
        departments
      },
      totalDepartments: departments.length
    });

  } catch (error) {
    console.error("Error fetching faculty with departments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Seed initial faculties (for setup)
 */
const seedFaculties = async (req, res) => {
  try {
    const { faculties } = req.body;

    if (!faculties || !Array.isArray(faculties)) {
      return res.status(400).json({ message: "Faculties array is required" });
    }

    const createdFaculties = [];
    const errors = [];

    for (let i = 0; i < faculties.length; i++) {      
      const { name, description, icon } = faculties[i];
      
      // Check if already exists
      const existing = await Faculty.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
      });
      
      if (existing) {
        errors.push(`Faculty "${name}" already exists`);
        continue;
      }

      const facultyId = await generateFacultyId();
      
      const newFaculty = new Faculty({
        facultyId,
        name,
        description: description || '',
        icon: icon || '',
        order: i + 1
      });

      const saved = await newFaculty.save();
      createdFaculties.push(saved);
      console.log(`Seeded faculty: ${saved.name}`);
    }

    res.status(201).json({
      message: `Successfully seeded ${createdFaculties.length} faculties`,
      created: createdFaculties,
      errors: errors.length > 0 ? errors : undefined,
      totalCreated: createdFaculties.length
    });

  } catch (error) {
    console.error("Error seeding faculties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createFaculty,
  getAllFaculties,
  getFacultyById,
  getFacultyByName,
  updateFaculty,
  deleteFaculty,
  getFacultyWithDepartments,
  seedFaculties
};
