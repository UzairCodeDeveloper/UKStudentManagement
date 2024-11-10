const Attendance = require('../../models/Attendence');
const Course = require('../../models/Course');
const Enrolment = require('../../models/Enrolment');

// 1. Create attendance record
exports.createAttendance = async (req, res) => {
    const { student_id, course_id, date, status } = req.body;  // Get data from request body

    try {
        const classObj = await Course.findById(course_id).select('class_id').lean();
        console.log(classObj.class_id);
        // Check if the student is enrolled in the course
        const enrollment = await Enrolment.findOne({
            'student_id': student_id,
            'class_id': classObj.class_id, // Ensure you're using 'class_id' or whatever represents course_id
        });

        if (!enrollment) {
            return res.status(404).json({ msg: 'Student not enrolled in this course' });
        }

        // Create a new attendance record
        const attendance = new Attendance({
            student_id,
            course_id,
            date,
            status,
        });

        await attendance.save();
        res.status(201).json({ msg: 'Attendance record created successfully', attendance });
    } catch (error) {
        console.error('Error creating attendance record:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// 2. Get attendance record for a student
exports.getStudentAttendance = async (req, res) => {
    const { course_id, student_id, date } = req.query;  // Use query params for course, student, and date

    try {
        const attendance = await Attendance.findOne({ 
            student_id, 
            course_id, 
            date: new Date(date) 
        }).lean();

        if (!attendance) {
            return res.status(404).json({ msg: 'Attendance not marked for this date' });
        }

        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error fetching attendance:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// 3. Update attendance record
exports.updateAttendance = async (req, res) => {
    const { attendance_id } = req.params;  // Attendance record ID to update
    const { status } = req.body;  // New status

    try {
        // Find the attendance record by ID and update
        const attendance = await Attendance.findByIdAndUpdate(
            attendance_id,
            { status },
            { new: true }  // Return the updated record
        );

        if (!attendance) {
            return res.status(404).json({ msg: 'Attendance record not found' });
        }

        res.status(200).json({ msg: 'Attendance record updated', attendance });
    } catch (error) {
        console.error('Error updating attendance:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// 4. Delete attendance record
exports.deleteAttendance = async (req, res) => {
    const { attendance_id } = req.params;  // Attendance record ID to delete

    try {
        const attendance = await Attendance.findByIdAndDelete(attendance_id);

        if (!attendance) {
            return res.status(404).json({ msg: 'Attendance record not found' });
        }

        res.status(200).json({ msg: 'Attendance record deleted successfully' });
    } catch (error) {
        console.error('Error deleting attendance record:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// 5. Get all attendance records for a course on a specific date
exports.getAllAttendanceForCourse = async (req, res) => {
    const { course_id, date } = req.query;  // Use query params for course and date

    try {
        const attendances = await Attendance.find({
            course_id,
            date: new Date(date)
        }).populate('student_id', 'studentData roll_number user_id _id').lean();

        if (attendances.length === 0) {
            return res.status(404).json({ msg: 'No attendance records for this course on the given date' });
        }

        res.status(200).json(attendances);
    } catch (error) {
        console.error('Error fetching attendance records:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};
