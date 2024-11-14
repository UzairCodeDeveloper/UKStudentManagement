const Course = require('../../models/Course');
const Class = require('../../models/Class');
const Student = require('../../models/User');
const Enrolment = require('../../models/Enrolment');



const getAllStudentCourses = async (req, res) => {
    const { id } = req.user; // Get instructor's ID from the middleware

    try {
        const enrolment = await Enrolment.findOne({ student_id: id })
        console.log(enrolment);
        // res.status(200).json(enrolment);
        const courses = await Course.find({ class_id: enrolment.class_id })
            .populate('class_id', 'class_name')
            .populate('instructor', 'volunteer_details.full_name')
            .select('course_name class_id');


        if (!courses.length) {
            return res.status(404).json({ msg: 'No courses found for this student' });
        }


        return res.status(200).json(courses);

    } catch (error) {

        console.error('Error fetching courses:', error.message);

        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get all courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ is_active: true })
            .populate('class_id') // Populate class details
            .populate({
                path: 'instructor',
                select: 'volunteer_details.full_name' // Only select the full_name field from the instructor
            })
            .sort({ 'class_id.class_name': 1 }); // Sort by class_name (1 for ascending, -1 for descending)

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
        // Validate if the ID is a valid MongoDB ObjectID
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ msg: 'Invalid course ID' });
        }

        // Fetch the course by ID and populate relevant fields
        const course = await Course.findById(id)
            .populate('class_id')  // Populate class details
            .populate({
                path: 'instructor',
                select: 'volunteer_details.full_name'  // Only fetch the full_name from the volunteer details
            })
            // .populate('session', 'session_year start_date end_date status')
            .lean();  // Use lean to get a plain JavaScript object for better performance

        // Check if course exists
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        const classDetails = await Class.findById(course.class_id._id).populate('session', 'session_year start_date end_date status').lean();
        // console.log(classDetails);

        // Return the course details
        res.status(200).json({ course, classDetails });
    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching course by ID:', error.message);
        // Return a server error response
        res.status(500).json({ msg: 'Server Error' });
    }
};


const getCourseDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const course = await Course.findById(id)
            .populate('class_id', 'class_name')
            .populate('instructor', 'volunteer_details.full_name')
            .populate('session', 'session_year start_date end_date status')
            .lean();

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course details:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get a single course by ID
const getCourseByIdInstructor = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Validate if the ID is a valid MongoDB ObjectID
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ msg: 'Invalid course ID' });
        }

        // Fetch the course by ID and populate relevant fields
        const course = await Course.findById({ _id: id, instructor: userId })
            .populate('class_id')  // Populate class details
            .populate({
                path: 'instructor',
                select: 'volunteer_details.full_name'  // Only fetch the full_name from the volunteer details
            })
            // .populate('session', 'session_year start_date end_date status')
            .lean();  // Use lean to get a plain JavaScript object for better performance

        // Check if course exists
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        const classDetails = await Class.findById(course.class_id._id).populate('session', 'session_year start_date end_date status').lean();
        // console.log(classDetails);

        // Return the course details
        res.status(200).json({ course, classDetails });
    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching course by ID:', error.message);
        // Return a server error response
        res.status(500).json({ msg: 'Server Error' });
    }
};




module.exports = {
    getAllStudentCourses,
    getAllCourses,
    getCourseById,
    getCourseByIdInstructor
};
