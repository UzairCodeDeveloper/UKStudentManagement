const express = require('express');
const router = express.Router();
const familyController = require('../../controller/FamilyController/FamilyController');
const adminAuth = require('../../middleware/adminAuth');
const familyAuth = require('../../middleware/familyAuth');

// Route to create a new family (POST)
router.post('/create',adminAuth, familyController.createFamily);

// Route to get all families (GET)
router.get('/',adminAuth, familyController.getAllFamilies);

// Route to get a family by its familyRegNo (GET)
router.get('/:familyRegNo',adminAuth, familyController.getFamilyByRegNo);

// Route to delete a family by ID (soft delete - update isActive to false) (DELETE)
router.delete('/delete/:familyId', familyController.deleteFamilyById);

// Family login route
router.post("/login", familyController.familyLogin);

// Example of a protected route
// router.get("/test", familyAuth, familyController.testController);

// Get all students belonging to the family
router.get('/getfam/students', familyAuth, familyController.getStudentsByFamily);

// Get student attendance by student ID
router.get('/attendance/:studentId', familyAuth, familyController.getAttendanceByStudentId);

// Add absent reason by attendance ID and student ID
router.put('/attendance/:attendanceId/student/:studentId/absent-reason', familyAuth, familyController.addAbsentReason);

// GET: Fetch percentage for a student
router.get("/percentage/:studentId", familyAuth, familyController.getStudentPercentage);
module.exports = router;
