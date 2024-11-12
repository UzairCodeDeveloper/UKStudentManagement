const express = require('express');
const router = express.Router();
const teacherAttendanceController = require('../../controller/AttendanceController/TeacherAttendanceController');
const auth = require('../../middleware/adminAuth');

// Route to mark or update teacher attendance
// POST /api/teacher-attendance
router.post('/', teacherAttendanceController.markOrUpdateTeacherAttendance);

// Route to get attendance for a specific date
// GET /api/teacher-attendance/:date
router.get('/teacher-attendance/:date', teacherAttendanceController.getTeacherAttendance);

// Route to get specific teacher attendance for a given date
// GET /api/teacher-attendance/:teacher_id/:date
router.get('/teacher-attendance/:teacher_id/:date', teacherAttendanceController.getSpecificTeacherAttendance);


module.exports = router;
