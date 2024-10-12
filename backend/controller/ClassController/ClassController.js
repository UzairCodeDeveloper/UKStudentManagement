const { default: mongoose } = require('mongoose');
const Class = require('../../models/Class');

// Create a new class
const createClass = async (req, res) => {
    const { class_name, courses } = req.body;

    try {

        if(!class_name){
            return res.status(400).json({ msg: 'Class name is required' });
        }

        let existingClass = await Class.findOne({ class_name }).where({ is_active: true });
        if (existingClass) {
            return res.status(400).json({ msg: 'Class with this name already exists' });
        }

        const newClass = new Class({
            class_name,
            courses
        });

        await newClass.save();
        res.status(201).json({ msg: 'Class created successfully', class: newClass });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get all classes (filter out inactive ones)
const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find({ is_active: true })
        // .populate('courses');
        res.status(200).json(classes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get class by ID
const getClassById = async (req, res) => {
    const { id } = req.params;

    try {
        const classObj = await Class.findById(id)
        // .populate('courses');
        if (!classObj) {
            return res.status(404).json({ msg: 'Class not found' });
        }
        res.status(200).json(classObj);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};


const updateClass = async (req, res) => {
    const { id } = req.params;
    const { class_name, courses } = req.body;

    try {
        const classObj = await Class.findById(id);

        if (!classObj) {
            return res.status(404).json({ msg: 'Class not found' });
        }

        // Check if another class with the same name already exists
        const existingClass = await Class.findOne({ class_name, _id: { $ne: id } });
        if (existingClass) {
            return res.status(400).json({ msg: 'Class with this name already exists' });
        }

        // Update class details
        classObj.class_name = class_name || classObj.class_name;
        classObj.courses = courses || classObj.courses;

        await classObj.save();
        res.status(200).json({ msg: 'Class updated successfully', class: classObj });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};


// Soft delete class by marking it inactive (is_active: false)
const deleteClass = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Check if ID is provided
      if (!id) {
        return res.status(400).json({ msg: 'Class ID is required' });
      }
  
      // Check if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid Class ID format' });
      }
  
      const classObj = await Class.findById(id);
  
      // Check if the class with the given ID exists
      if (!classObj) {
        return res.status(404).json({ msg: 'Class not found' });
      }
  
      // Mark the class as inactive instead of deleting it
      classObj.is_active = false;
      await classObj.save();
  
      res.status(200).json({ msg: 'Class marked as inactive successfully', class: classObj });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server Error' });
    }
  };


module.exports = {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass
};
