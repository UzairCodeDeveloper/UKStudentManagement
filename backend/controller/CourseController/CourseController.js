const Course = require('../../models/Course');
const Class = require('../../models/Class');
const Volunteer = require('../../models/Volunteer');
// Create a new course
const createCourse = async (req, res) => {
    const { course_name, course_description, class_id, volunteer_id } = req.body;
  
    try {
      // Validation checks
      if (!course_name) {
        return res.status(400).json({ msg: 'Course name is required' });
      }
      if (!class_id) {
        return res.status(400).json({ msg: 'Class ID is required' });
      }
      if (!volunteer_id) {
        return res.status(400).json({ msg: 'Instructor ID is required' });
      }

  
      // Check if the course already exists for the class
      const course = await Course.findOne({ course_name, class_id });
      
      if (course) {
        return res.status(400).json({ msg: 'Course already exists' });
      }

      const classDetails = await Class.findById(class_id);

        if (!classDetails) {
            return res.status(404).json({ msg: 'Class not found' });
        }

        const instructor = await Volunteer.findById(volunteer_id);

        if (!instructor) {
            return res.status(404).json({ msg: 'Instructor not found' });
        }

        const volunteer = await Volunteer.findById(volunteer_id);

        if (!volunteer) {
            return res.status(404).json({ msg: 'Instructor not found' });
        }
  
      // Create a new course instance
      const newCourse = new Course({
        course_name,
        course_description,
        class_id,
        instructor: volunteer_id,
      });
  
      // Save the course to the database
      await newCourse.save();
  
      // Respond with success message
      res.status(201).json({ msg: 'Course created successfully', course: newCourse });
    } catch (error) {
      console.error(error.message);
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
        res.status(200).json({course, classDetails});
    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching course by ID:', error.message);
        // Return a server error response
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Update a course by ID
const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { course_name, course_description, class_id, volunteer_id } = req.body;

    try {
        // Validate Course ID
        if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ msg: 'Invalid course ID' });
        }

        // Validate input fields
        if (!course_name && !course_description && !class_id && !volunteer_id) {
            return res.status(400).json({ msg: 'At least one field must be provided for update' });
        }

        // Check if volunteer exists (if provided)
        let volunteerExists = null;
        if (volunteer_id) {
            if (!volunteer_id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ msg: 'Invalid volunteer ID' });
            }

            volunteerExists = await Volunteer.findById(volunteer_id);
            if (!volunteerExists) {
                return res.status(404).json({ msg: 'Volunteer (Instructor) not found' });
            }
        }

        // Find and update the course
        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            {
                $set: {
                    course_name: course_name || undefined,
                    course_description: course_description || undefined,
                    class_id: class_id || undefined,
                    instructor_id: volunteer_id || undefined,  // Update instructor if volunteer exists
                },
            },
            { new: true, runValidators: true }  // Return updated course and apply validators
        ).populate('class_id')
        .populate({
            path: 'instructor', 
            select: 'volunteer_details.full_name'  // Only fetch the full_name from the volunteer details
        })
        .lean(); // Populate class and instructor details

        // Check if the course exists
        if (!updatedCourse) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        // Return success response
        res.status(200).json({
            msg: 'Course updated successfully',
            course: updatedCourse,
        });
    } catch (error) {
        // Log and return a server error response
        console.error('Error updating course:', error.message);
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

const getAllTeacherCourses = async (req, res) => {
    const { id } = req.user; // Get instructor's ID from the middleware

    try {
        
        const courses = await Course.find({ instructor: id })
            .populate('class_id', 'class_name') 
            .select('course_name class_id');   

        
        if (!courses.length) {
            return res.status(404).json({ msg: 'No courses found for this instructor' });
        }

        
        return res.status(200).json(courses);

    } catch (error) {
        
        console.error('Error fetching courses:', error.message);
        
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
        const course = await Course.findById({_id:id, instructor: userId})
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
        res.status(200).json({course, classDetails});
    } catch (error) {
        // Log the error for debugging
        console.error('Error fetching course by ID:', error.message);
        // Return a server error response
        res.status(500).json({ msg: 'Server Error' });
    }
};
  
module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,

    // For Instructors
    getAllTeacherCourses,
    getCourseByIdInstructor
};
