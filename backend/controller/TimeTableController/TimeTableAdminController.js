const Timetable = require('../../models/TimeTable');
const Volunteer = require('../../models/Volunteer'); // Assuming Teacher is referenced via the Volunteer model
const Course = require('../../models/Course');
const Class = require('../../models/Class');

// Create a new timetable entry
// Create or Update Timetable (POST)
exports.createTimetable = async (req, res) => {
    try {
      const { class_id, course, teacher, day_of_week, start_time, end_time } = req.body;
  
      // Check if the class exists
      const classExists = await Class.findById(class_id);
      if (!classExists) {
        return res.status(400).json({ success: false, message: 'Class not found' });
      }
  
      // Check if the course exists
      const courseExists = await Course.findById(course).populate('instructor');
      if (!courseExists) {
        return res.status(400).json({ success: false, message: 'Course not found' });
      }
  
      // Check if the teacher exists and is assigned to the course
      const teacherExists = await Volunteer.findById(teacher); // Assuming Teacher is referenced via the Volunteer model
      if (!teacherExists) {
        return res.status(400).json({ success: false, message: 'Teacher not found' });
      }
      
      if (courseExists.instructor._id.toString() !== teacher) {
        console.log(teacher);
        console.log(courseExists.instructor._id.toString());
        return res.status(400).json({
          success: false,
          message: 'This teacher is not assigned to the selected course'
        });
      }
  
      // Check if the teacher is already assigned to a class at the same time
      const existingTimetable = await Timetable.findOne({
        teacher: teacher,
        day_of_week: day_of_week,
        start_time: { $lte: end_time },   // Check if the time overlap
        end_time: { $gte: start_time }    // Check if the time overlap
      }).populate('teacher class_id course');
  
      if (existingTimetable) {
        return res.status(400).json({
          success: false,
          message: `${existingTimetable.teacher.volunteer_details.full_name} is already assigned to ${existingTimetable.class_id.class_name} at ${existingTimetable.start_time} - ${existingTimetable.end_time}`
        });
      }
  
      // If no overlap, create a new timetable
      const newTimetable = new Timetable({
        class_id,
        course,
        teacher,
        day_of_week,
        start_time,
        end_time
      });
  
      const savedTimetable = await newTimetable.save();
      res.status(201).json({
        success: true,
        data: savedTimetable
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  };


// Get all timetables for a specific class and sort by Day of the week
exports.getTimetableByClass = async (req, res) => {
  try {
    const { class_id } = req.params;

    const timetables = await Timetable.find({ class_id }).populate('course teacher');

    if (!timetables.length) {
      return res.status(404).json({
        success: false,
        message: 'No timetable found for this class.'
      });
    }

    // Group timetables by day_of_week
    const groupedTimetables = timetables.reduce((acc, timetable) => {
      const day = timetable.day_of_week; // e.g., Monday, Tuesday
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(timetable);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: groupedTimetables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update a timetable entry
// exports.updateTimetable = async (req, res) => {
//   try {
//     const { timetableId } = req.params;
//     const { class_id, course, teacher, day_of_week, start_time, end_time } = req.body;

//     const updatedTimetable = await Timetable.findByIdAndUpdate(
//       timetableId,
//       { class_id, course, teacher, day_of_week, start_time, end_time },
//       { new: true }
//     );

//     if (!updatedTimetable) {
//       return res.status(404).json({
//         success: false,
//         message: 'Timetable entry not found.'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Timetable entry updated successfully.',
//       data: updatedTimetable
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server Error',
//       error: error.message
//     });
//   }
// };

// Delete a timetable entry
exports.deleteTimetable = async (req, res) => {
  try {
    const { timetableId } = req.params;

    const timetable = await Timetable.findByIdAndDelete(timetableId);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable entry not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Timetable entry deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get timetable by teacher (optional for admin)
exports.getTimetableByTeacher = async (req, res) => {
    try {
      const { teacherId } = req.params;
  
      const timetables = await Timetable.find({ teacher: teacherId }).populate('course class_id');
  
      if (!timetables.length) {
        return res.status(404).json({
          success: false,
          message: 'No timetable found for this teacher.'
        });
      }
  
      // Define the order for days of the week
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
      // Group and sort timetables by day_of_week
      const groupedTimetables = timetables.reduce((acc, timetable) => {
        const day = timetable.day_of_week; // e.g., Monday, Tuesday
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(timetable);
        return acc;
      }, {});
  
      // Sort the grouped days by the predefined dayOrder
      const sortedTimetables = Object.keys(groupedTimetables)
        .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b)) // Sort by day order
        .reduce((acc, day) => {
          acc[day] = groupedTimetables[day];
          return acc;
        }, {});
  
      res.status(200).json({
        success: true,
        data: sortedTimetables
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
  