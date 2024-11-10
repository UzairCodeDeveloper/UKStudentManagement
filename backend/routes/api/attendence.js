const express = require('express');
const router = express.Router();
const { createAttendance, getStudentAttendance, updateAttendance, deleteAttendance, getAllAttendanceForCourse } = require('../../controller/TeacherControllers/AttendenceController');  // Adjust path according to your structure

// 1. Create attendance record
router.post('/mark-attendence', createAttendance);

// 2. Get student attendance for a course on a specific date
router.get('/attendance/student', getStudentAttendance);

// 3. Update attendance record
router.put('/attendance/:attendance_id', updateAttendance);

// 4. Delete attendance record
router.delete('/attendance/:attendance_id', deleteAttendance);

// 5. Get all attendance records for a course on a specific date
router.get('/course', getAllAttendanceForCourse);

module.exports = router;
