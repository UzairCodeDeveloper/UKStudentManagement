const TeacherAttendance = require('../../models/TeacherAttendance');
const Volunteer = require('../../models/Volunteer');


// Controller to mark or update teacher attendance
exports.markOrUpdateTeacherAttendance = async (req, res) => {
  try {
    const { date, attendance } = req.body;

    // Find if attendance already exists for the date
    let teacherAttendance = await TeacherAttendance.findOne({ date });

    if (teacherAttendance) {
      // If attendance exists, update the record
      teacherAttendance.attendance = attendance; 
      await teacherAttendance.save();
    } else {
      // Otherwise, create a new record
      teacherAttendance = new TeacherAttendance({
        date,
        attendance
      });
      await teacherAttendance.save();
    }

    res.status(200).json({
      message: 'Teacher attendance marked/updated successfully',
      data: teacherAttendance
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while marking/updating attendance',
      error: error.message
    });
  }
};

// Controller to get teacher attendance for a specific date
exports.getTeacherAttendance = async (req, res) => {
  try {
    const { date } = req.params; // Get the date from request parameters

    // Fetch the attendance for the specified date
    const teacherAttendance = await TeacherAttendance.findOne({ date })
      .populate({
        path: 'attendance.teacher_id', // Populate teacher_id from Volunteer schema
        select: 'volunteer_details.full_name employee_id', // Select only required fields
      });

    if (teacherAttendance) {
      // Attendance record exists
      return res.status(200).json({
        message: 'Teacher attendance retrieved successfully',
        attendanceFound: true,
        data: teacherAttendance.attendance.map(item => ({
          teacher_id: item.teacher_id._id, // Teacher ID
          full_name: item.teacher_id.volunteer_details.full_name, // Teacher full name
          employee_id: item.teacher_id.employee_id, // Employee ID
          status: item.status, // Attendance status
        })),
      });
    }

    // Attendance record does not exist, list all teachers
    const allTeachers = await Volunteer.find()
      .select('volunteer_details.full_name employee_id'); // Select required fields

    if (!allTeachers.length) {
      return res.status(404).json({
        message: 'No teachers found in the system',
        attendanceFound: false,
        data: [],
      });
    }

    res.status(200).json({
      message: 'No attendance found for the given date. Showing all teachers without attendance status.',
      attendanceFound: false,
      data: allTeachers.map(teacher => ({
        teacher_id: teacher._id,
        full_name: teacher.volunteer_details.full_name, // Full name from nested field
        employee_id: teacher.employee_id, // Employee ID
        status: null, // No attendance status
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving attendance',
      error: error.message,
    });
  }
};


// Controller to get the attendance of a specific teacher for a specific date
exports.getSpecificTeacherAttendance = async (req, res) => {
  try {
    const { teacher_id } = req.params;

    // Find all attendance records for the specific teacher
    const teacherAttendance = await TeacherAttendance.find({
      'attendance.teacher_id': teacher_id
    });

    if (!teacherAttendance.length) {
      return res.status(404).json({
        message: 'No attendance records found for the given teacher'
      });
    }

    // Extract all attendance entries for the given teacher
    const specificAttendance = teacherAttendance.map(record =>
      record.attendance.filter(att => att.teacher_id.toString() === teacher_id)
    ).flat(); // Flatten the array of arrays

    res.status(200).json({
      message: 'Teacher attendance records retrieved successfully',
      data: specificAttendance
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving teacher attendance records',
      error: error.message
    });
  }
};


exports.getSpecificTeacherAttendanceForTeacherPannel = async (req, res) => {
  try {
    const teacher_id  = req.user.id;

    // Find all attendance records for the specific teacher
    const teacherAttendance = await TeacherAttendance.find({
      'attendance.teacher_id': teacher_id
    });

    if (!teacherAttendance.length) {
      return res.status(404).json({
        message: 'No attendance records found for the given teacher'
      });
    }

    // Extract all attendance entries for the given teacher
    const specificAttendance = teacherAttendance.map(record =>
      record.attendance.filter(att => att.teacher_id.toString() === teacher_id)
    ).flat(); // Flatten the array of arrays

    res.status(200).json({
      message: 'Teacher attendance records retrieved successfully',
      data: specificAttendance
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving teacher attendance records',
      error: error.message
    });
  }
};