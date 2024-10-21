const mongoose = require('mongoose');
const Class = require('../../models/Class');
const Session = require('../../models/Session');

// Create a new class
const createClass = async (req, res) => {
    const { class_name, session } = req.body;

    try {
        // Check if class_name is provided
        if (!class_name) {
            return res.status(400).json({ msg: 'Class name is required' });
        }

        // Check if session ID is provided
        if (!session) {
            return res.status(400).json({ msg: 'Session ID is required' });
        }

        // Validate session ID format
        if (!mongoose.Types.ObjectId.isValid(session)) {
            return res.status(400).json({ msg: 'Invalid session ID format' });
        }

        // Check if session exists
        const existingSession = await Session.findById(session);
        if (!existingSession) {
            return res.status(404).json({ msg: 'Session not found' });
        }

        // Check if class with the same name exists for the given session
        let existingClass = await Class.findOne({ class_name, session });
        if (existingClass) {
            return res.status(400).json({ msg: `Class with name "${class_name}" already exists for this session` });
        }

        // Create new class
        const newClass = new Class({
            class_name,
            session,
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
// Get class by ID
const getClassById = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid Class ID format' });
        }

        // Find class by ID and populate session
        const classObj = await Class.findById(id).populate('session');
        if (!classObj) {
            return res.status(404).json({ msg: 'Class not found' });
        }

        res.status(200).json(classObj);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};


// Update class
const updateClass = async (req, res) => {
    const { id } = req.params;
    const { class_name, session } = req.body;

    try {
        // Check if the class ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid Class ID format' });
        }

        const classObj = await Class.findById(id);
        if (!classObj) {
            return res.status(404).json({ msg: 'Class not found' });
        }

        // If session is provided, validate it
        if (session) {
            if (!mongoose.Types.ObjectId.isValid(session)) {
                return res.status(400).json({ msg: 'Invalid Session ID format' });
            }

            const existingSession = await Session.findById(session);
            if (!existingSession) {
                return res.status(404).json({ msg: 'Session not found' });
            }
        }

        // Check for duplicate class name within the same session
        const existingClass = await Class.findOne({
            class_name, 
            session: session || classObj.session, // Keep the current session if not provided
            _id: { $ne: id } // Exclude current class from the search
        });

        if (existingClass) {
            return res.status(400).json({ msg: `Class with name "${class_name}" already exists for this session` });
        }

        // Update class details
        classObj.class_name = class_name || classObj.class_name;
        classObj.session = session || classObj.session;

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
        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: 'Invalid Class ID format' });
        }

        // Find class by ID
        const classObj = await Class.findById(id);
        if (!classObj) {
            return res.status(404).json({ msg: 'Class not found' });
        }

        // Mark the class as inactive
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
