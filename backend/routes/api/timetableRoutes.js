const express = require('express');
const router = express.Router();
const timetableController = require('../../controller/TimeTableController/TimeTableAdminController');
const adminAuth = require('../../middleware/adminAuth');
const studentAuth = require('../../middleware/studentAuth');
const volunteerAuth = require('../../middleware/volunteerAuth');
// add middlware (--------------------------------------------------
// --------------------------------------------------)

// Route to create a new timetable entry (Admin)
router.post('/',adminAuth, timetableController.createTimetable);


// // Route to get timetable for a specific class (Student)
router.get('/class/:class_id',adminAuth, timetableController.getTimetableByClass);

router.get('/classstudent/:class_id',studentAuth, timetableController.getTimetableByClass);

// // Route to get timetable for a specific teacher (Admin)
router.get('/teacher/:teacherId',volunteerAuth, timetableController.getTimetableByTeacher);

// // Route to update a specific timetable entry (Admin)
// router.put('/timetable/:timetableId', timetableController.updateTimetable);

// // Route to delete a specific timetable entry (Admin)
router.delete('/delete/:timetableId',adminAuth, timetableController.deleteTimetable);

module.exports = router;
