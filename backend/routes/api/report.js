const express = require('express');
const {ClassbasedPerformance, generateStudentReport,getStudentsByClassId,generateDetailedStudentReport} = require('../../controller/ReportsController/ReportController');
const adminAuth = require('../../middleware/adminAuth');
// const familyAuth = require('../../middleware/familyAuth');
const router = express.Router();

// Get all fee records
router.get('/classbasedperformance/:classId', adminAuth,ClassbasedPerformance);
router.get('/generateStudentReport/:studentId', adminAuth,generateStudentReport);
router.get('/getStudentsbyclassid/:classId', adminAuth,getStudentsByClassId);
router.post('/generateDetailedStudentReport/:studentId', adminAuth,generateDetailedStudentReport);




module.exports = router;
