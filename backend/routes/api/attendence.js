const express = require('express');
const router = express.Router();

// get teacher middleware 
const teacherAuth = require("../../middleware/volunteerAuth")
const studentAuth = require("../../middleware/studentAuth")
const { FetchAttendanceRecord,getAttendanceRecordsForInstructor, getEnrolledStudentsInClass,markAttendance,getUserAttendance
    // createAttendance, getStudentAttendance, updateAttendance, deleteAttendance
} = require('../../controller/TeacherControllers/AttendenceController');  // Adjust path according to your structure
const adminAuth = require('../../middleware/adminAuth');


// 1. Get classes of the instructor is assiged to
router.get('/classes',teacherAuth,getAttendanceRecordsForInstructor);

// 2. Fetch attendance records for a class
router.get('/fetchrecords/:class_id/:date', teacherAuth, FetchAttendanceRecord);

// 3. Route to mark attendance
router.post('/markattendance', teacherAuth, markAttendance);


router.post('/markstudentattendanceadmin', adminAuth, markAttendance);

router.get('/get-my-attendance/', studentAuth, getUserAttendance);

// For specific month and year
// router.get('/get-my-attendance/:month/:year', studentAuth, getUserAttendanceByMonth);
// ______________________________________________________________________________________________________________________

// // 1. Create attendance record
// router.post('/mark-attendence', createAttendance);

// // 2. Get student attendance for a course on a specific date
// router.get('/attendance/student', getStudentAttendance);

// // 3. Update attendance record
// router.put('/attendance/:attendance_id', updateAttendance);

// // 4. Delete attendance record
// router.delete('/attendance/:attendance_id', deleteAttendance);

// // 5. Get all attendance records for a course on a specific date
// router.get('/get', getAllAttendanceForCourse);

module.exports = router;
