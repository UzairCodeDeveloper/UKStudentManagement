const express = require('express');
const {FetchStudentRecords,creatinggrade,FetchRecords,DeleteGradingRecord } = require('../../controller/GradingController/GradingController');
const adminAuth = require('../../middleware/adminAuth');
// const familyAuth = require('../../middleware/familyAuth');
const router = express.Router();

// Get all fee records
router.post('/grading', adminAuth,FetchStudentRecords);

router.post('/create-grading', adminAuth,creatinggrade);


// Get all fee records
router.post('/fetchGrades', adminAuth,FetchRecords);


router.delete('/deletegrades/:id',adminAuth, DeleteGradingRecord);
module.exports = router;
