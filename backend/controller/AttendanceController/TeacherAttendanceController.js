const TeacherAttendance = require('../../models/TeacherAttendance');


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
    const { date } = req.params;

    // Find the attendance for the given date
    const teacherAttendance = await TeacherAttendance.findOne({ date })
      .populate('teacher_id', 'name'); // Assuming "name" is a field in the Volunteer schema

    if (!teacherAttendance) {
      return res.status(404).json({
        message: 'Attendance not found for the given date'
      });
    }

    res.status(200).json({
      message: 'Teacher attendance retrieved successfully',
      data: teacherAttendance
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving attendance',
      error: error.message
    });
  }
};

// Controller to get the attendance of a specific teacher for a specific date
exports.getSpecificTeacherAttendance = async (req, res) => {
  try {
    const { teacher_id, date } = req.params;

    // Find the attendance record for the specific teacher on the given date
    const teacherAttendance = await TeacherAttendance.findOne({
      date,
      'attendance.teacher_id': teacher_id
    });

    if (!teacherAttendance) {
      return res.status(404).json({
        message: 'Attendance not found for the given teacher and date'
      });
    }

    // Extract specific teacher attendance from the array
    const specificAttendance = teacherAttendance.attendance.find(att => att.teacher_id.toString() === teacher_id);

    res.status(200).json({
      message: 'Teacher attendance retrieved successfully',
      data: specificAttendance
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving specific teacher attendance',
      error: error.message
    });
  }
};
