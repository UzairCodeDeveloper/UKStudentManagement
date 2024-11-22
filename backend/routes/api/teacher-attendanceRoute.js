const express = require('express');
const router = express.Router();
const teacherAttendanceController = require('../../controller/AttendanceController/TeacherAttendanceController');
const auth = require('../../middleware/adminAuth');
const volunteerAuth = require('../../middleware/volunteerAuth');
const adminAuth = require('../../middleware/adminAuth');

// Route to mark or update teacher attendance
// POST /api/teacher-attendance
router.post('/', teacherAttendanceController.markOrUpdateTeacherAttendance);

// Route to get attendance of all teachers for a specific date
// GET /api/teacher-attendance/:date
router.get('/teacher-attendance/:date',adminAuth, teacherAttendanceController.getTeacherAttendance);
// GET /api/teacher-attendance/search-by-teacher/:teacher_id
router.get('/search-by-teacher/:teacher_id',adminAuth, teacherAttendanceController.getSpecificTeacherAttendance);

router.get('/search-by-teacher',volunteerAuth, teacherAttendanceController.getSpecificTeacherAttendanceForTeacherPannel);


// router.get('/teacher-attendance/:teacher_id/:date', teacherAttendanceController.getSpecificTeacherAttendance);


module.exports = router;
