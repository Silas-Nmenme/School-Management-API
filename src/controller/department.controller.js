const Department = require("../models/department.schema.js");
const Faculty = require("../models/faculty.schema.js");

/**
 * Generate a unique department ID
 * Format: DEPT{numeric sequence}
 */
const generateDepartmentId = async () => {
  const count = await Department.countDocuments();
  return 'DEPT' + String(count + 1).padStart(4, '0');
};

/**
 * Create a new Department
 */
const createDepartment = async (req, res) => {
  try {
    const { name, description, faculty, order } = req.body;

    if (!name || !faculty) {
      return res.status(400).json({ message: "Department name and faculty are required" });
    }

    // Verify faculty exists
    const existingFaculty = await Faculty.findById(faculty);
    if (!existingFaculty) {
      return res.status(400).json({ message: "Faculty not found" });
    }

    // Check if department with same name in the same faculty exists
    const existingDepartment = await Department.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      faculty: faculty
    });
    
    if (existingDepartment) {
      return res.status(400).json({ message: "Department with this name already exists in this faculty" });
    }

    const departmentId = await generateDepartmentId();

    const newDepartment = new Department({
      departmentId,
      name,
      description: description || '',
      faculty,
      order: order || 0
    });

    const savedDepartment = await newDepartment.save();

    // Populate faculty information
    await savedDepartment.populate('faculty', 'name facultyId');

    res.status(201).json({
      message: "Department created successfully",
      department: savedDepartment
    });

    console.log("New department created:", {
      id: savedDepartment._id,
      departmentId: savedDepartment.departmentId,
      name: savedDepartment.name,
      faculty: existingFaculty.name
    });

  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all Departments
 */
const getAllDepartments = async (req, res) => {
  try {
    const { facultyId, includeInactive } = req.query;
    
    let query = {};
    
    if (facultyId) {
      query.faculty = facultyId;
    }
    
    if (!includeInactive) {
      query.isActive = true;
    }

    const departments = await Department.find(query)
      .populate('faculty', 'name facultyId')
      .sort({ order: 1, name: 1 });

    res.status(200).json({
      message: "Departments retrieved successfully",
      totalDepartments: departments.length,
      departments
    });

    console.log(`Retrieved ${departments.length} departments`);

  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get Department by ID
 */
const getDepartmentById = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId)
      .populate('faculty', 'name facultyId');

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department retrieved successfully",
      department
    });

  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get Department by Name
 */
const getDepartmentByName = async (req, res) => {
  try {
    const { name } = req.params;
    const { facultyId } = req.query;

    let query = { name: { $regex: new RegExp(`^${name}$`, 'i') } };
    
    if (facultyId) {
      query.faculty = facultyId;
    }

    const department = await Department.findOne(query)
      .populate('faculty', 'name facultyId');

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({
      message: "Department retrieved successfully",
      department
    });

  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get Departments by Faculty
 */
const getDepartmentsByFaculty = async (req, res) => {
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
      message: `Departments for ${faculty.name} retrieved successfully`,
      faculty: {
        _id: faculty._id,
        name: faculty.name,
        facultyId: faculty.facultyId
      },
      totalDepartments: departments.length,
      departments
    });

  } catch (error) {
    console.error("Error fetching departments by faculty:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Update Department
 */
const updateDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { name, description, faculty, order, isActive } = req.body;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // If changing faculty, verify new faculty exists
    if (faculty && faculty.toString() !== department.faculty.toString()) {
      const existingFaculty = await Faculty.findById(faculty);
      if (!existingFaculty) {
        return res.status(400).json({ message: "Faculty not found" });
      }
    }

    // Check if updating name to one that already exists in the same faculty
    if (name && name !== department.name) {
      const targetFaculty = faculty || department.faculty;
      const existingDepartment = await Department.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        faculty: targetFaculty,
        _id: { $ne: departmentId }
      });
      
      if (existingDepartment) {
        return res.status(400).json({ message: "Department with this name already exists in this faculty" });
      }
    }

    // Update fields
    if (name) department.name = name;
    if (description !== undefined) department.description = description;
    if (faculty) department.faculty = faculty;
    if (order !== undefined) department.order = order;
    if (isActive !== undefined) department.isActive = isActive;

    const updatedDepartment = await department.save();
    
    // Populate faculty information
    await updatedDepartment.populate('faculty', 'name facultyId');

    res.status(200).json({
      message: "Department updated successfully",
      department: updatedDepartment
    });

    console.log(`Department updated - ID: ${departmentId}, Name: ${updatedDepartment.name}`);

  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete Department
 */
const deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await Department.findByIdAndDelete(departmentId);

    res.status(200).json({ message: "Department deleted successfully" });

    console.log(`Department deleted - ID: ${departmentId}, Name: ${department.name}`);

  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Seed initial departments (for setup)
 */
const seedDepartments = async (req, res) => {
  try {
    const { departments } = req.body;

    if (!departments || !Array.isArray(departments)) {
      return res.status(400).json({ message: "Departments array is required" });
    }

    const createdDepartments = [];
    const errors = [];

    for (let i = 0; i < departments.length; i++) {
      const { name, description, facultyName } = departments[i];
      
      if (!name || !facultyName) {
        errors.push(`Missing name or facultyName for department at index ${i}`);
        continue;
      }

      // Find faculty by name
      const faculty = await Faculty.findOne({ 
        name: { $regex: new RegExp(`^${facultyName}$`, 'i') } 
      });
      
      if (!faculty) {
        errors.push(`Faculty "${facultyName}" not found for department "${name}"`);
        continue;
      }

      // Check if already exists
      const existing = await Department.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        faculty: faculty._id
      });
      
      if (existing) {
        errors.push(`Department "${name}" already exists in faculty "${facultyName}"`);
        continue;
      }

      const departmentId = await generateDepartmentId();
      
      const newDepartment = new Department({
        departmentId,
        name,
        description: description || '',
        faculty: faculty._id,
        order: i + 1
      });

      const saved = await newDepartment.save();
      await saved.populate('faculty', 'name facultyId');
      
      createdDepartments.push(saved);
      console.log(`Seeded department: ${saved.name} in ${faculty.name}`);
    }

    res.status(201).json({
      message: `Successfully seeded ${createdDepartments.length} departments`,
      created: createdDepartments,
      errors: errors.length > 0 ? errors : undefined,
      totalCreated: createdDepartments.length
    });

  } catch (error) {
    console.error("Error seeding departments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Search departments
 */
const searchDepartments = async (req, res) => {
  try {
    const { q, facultyId } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    let query = { 
      name: { $regex: q, $options: 'i' }
    };

    if (facultyId) {
      query.faculty = facultyId;
    }

    const departments = await Department.find(query)
      .populate('faculty', 'name facultyId')
      .limit(20);

    res.status(200).json({
      message: "Search results retrieved successfully",
      totalResults: departments.length,
      departments
    });

  } catch (error) {
    console.error("Error searching departments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  getDepartmentByName,
  getDepartmentsByFaculty,
  updateDepartment,
  deleteDepartment,
  seedDepartments,
  searchDepartments
};
