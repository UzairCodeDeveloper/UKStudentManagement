const Course = require('../../models/Course');

// Create a new course
const createCourse = async (req, res) => {
    const { course_name, course_description, class_id } = req.body;

    try {
        if (!course_name) {
            return res.status(400).json({ msg: 'Course name is required' });
        }
        if(!class_id){
            return res.status(400).json({ msg: 'Class ID is required' });
        }
        const course = Course.find({course_name})
        if(course){
            return res.status(400).json({msg:"Course already Exists"})
        }
        // Create a new course instance
        const newCourse = new Course({
            course_name,
            course_description,
            class_id
        });

        // Save the course to the database
        await newCourse.save();
        res.status(201).json({ msg: 'Course created successfully', course: newCourse });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('class_id'); // Populate class details
        res.status(200).json(courses);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
    const { id } = req.params;

    try {
        if(!id){
            return res.status(400).json({ msg: 'Course ID is required' });
        }
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ msg: 'Invalid course ID' });
        }
        const course = await Course.findById(id).populate('class_id'); // Populate class details
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Update a course by ID
const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { course_name, course_description, class_id } = req.body;

    try {
        if(!id){
            return res.status(400).json({ msg: 'Course ID is required' });
        }
        let course = await Course.findById(id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Update course fields
        course.course_name = course_name || course.course_name;
        course.course_description = course_description || course.course_description;
        course.class_id = class_id || course.class_id;

        // Save the updated course
        await course.save();
        res.status(200).json({ msg: 'Course updated successfully', course });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Delete a course (soft delete or permanent deletion based on your needs)
const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Soft delete by setting is_active to false
        course.is_active = false;
        await course.save();

        res.status(200).json({ msg: 'Course deactivated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};


module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};
