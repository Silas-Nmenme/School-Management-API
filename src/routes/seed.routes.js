const express = require('express');
const Faculty = require('../models/faculty.schema.js');
const Department = require('../models/department.schema.js');
const { facultiesData, departmentsData } = require('../utils/seedData.js');

const router = express.Router();

// Helper function to generate faculty ID
const generateFacultyId = async () => {
  const count = await Faculty.countDocuments();
  return 'FAC' + String(count + 1).padStart(3, '0');
};

// Helper function to generate department ID
const generateDepartmentId = async () => {
  const count = await Department.countDocuments();
  return 'DEPT' + String(count + 1).padStart(4, '0');
};

// POST /api/seed/all - Seed all faculties and departments
router.post('/all', async (req, res) => {
  try {
    console.log('Starting seed process...');
    
    // Seed faculties
    const createdFaculties = [];
    for (let i = 0; i < facultiesData.length; i++) {
      const { name, description, icon } = facultiesData[i];
      
      const existing = await Faculty.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
      });
      
      if (existing) {
        createdFaculties.push(existing);
        console.log(`Faculty "${name}" already exists, skipping...`);
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

    // Seed departments
    const createdDepartments = [];
    for (let i = 0; i < departmentsData.length; i++) {
      const { name, facultyName } = departmentsData[i];
      
      // Find faculty by name
      const faculty = await Faculty.findOne({ 
        name: { $regex: new RegExp(`^${facultyName}$`, 'i') } 
      });
      
      if (!faculty) {
        console.log(`Faculty "${facultyName}" not found for department "${name}", skipping...`);
        continue;
      }

      const existing = await Department.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        faculty: faculty._id
      });
      
      if (existing) {
        createdDepartments.push(existing);
        console.log(`Department "${name}" already exists, skipping...`);
        continue;
      }

      const departmentId = await generateDepartmentId();
      const newDepartment = new Department({
        departmentId,
        name,
        description: '',
        faculty: faculty._id,
        order: i + 1
      });

      const saved = await newDepartment.save();
      await saved.populate('faculty', 'name facultyId');
      createdDepartments.push(saved);
      console.log(`Seeded department: ${saved.name} in ${faculty.name}`);
    }

    res.status(201).json({
      message: 'Seed completed successfully',
      summary: {
        totalFaculties: createdFaculties.length,
        totalDepartments: createdDepartments.length
      },
      faculties: createdFaculties,
      departments: createdDepartments
    });

  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// POST /api/seed/faculties - Seed only faculties
router.post('/faculties', async (req, res) => {
  try {
    const createdFaculties = [];
    
    for (let i = 0; i < facultiesData.length; i++) {
      const { name, description, icon } = facultiesData[i];
      
      const existing = await Faculty.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') } 
      });
      
      if (existing) {
        createdFaculties.push(existing);
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
    }

    res.status(201).json({
      message: 'Faculties seeded successfully',
      totalFaculties: createdFaculties.length,
      faculties: createdFaculties
    });

  } catch (error) {
    console.error('Error seeding faculties:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/seed/departments - Seed only departments
router.post('/departments', async (req, res) => {
  try {
    const createdDepartments = [];
    
    for (let i = 0; i < departmentsData.length; i++) {
      const { name, facultyName } = departmentsData[i];
      
      const faculty = await Faculty.findOne({ 
        name: { $regex: new RegExp(`^${facultyName}$`, 'i') } 
      });
      
      if (!faculty) {
        continue;
      }

      const existing = await Department.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        faculty: faculty._id
      });
      
      if (existing) {
        createdDepartments.push(existing);
        continue;
      }

      const departmentId = await generateDepartmentId();
      const newDepartment = new Department({
        departmentId,
        name,
        description: '',
        faculty: faculty._id,
        order: i + 1
      });

      const saved = await newDepartment.save();
      await saved.populate('faculty', 'name facultyId');
      createdDepartments.push(saved);
    }

    res.status(201).json({
      message: 'Departments seeded successfully',
      totalDepartments: createdDepartments.length,
      departments: createdDepartments
    });

  } catch (error) {
    console.error('Error seeding departments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
