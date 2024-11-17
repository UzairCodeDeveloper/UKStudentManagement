const express = require('express');
const router = express.Router();
const {
    addSubmission,
    getSubmissionsByResource,
    updateSubmissionMarks,
    getSubmissionsByStudent,
    getResourceById,
    getSubmissionById,
    markSubmissionMarks
} = require('../../controller/SubmissionController/SubmissionController');
const { pdfUpload } = require('../../config/multerConfigPdf'); 
const studentAuth = require('../../middleware/studentAuth');  
const teacherAuth = require('../../middleware/volunteerAuth'); 

// Add a submission (Student)
router.post('/submit', studentAuth, pdfUpload.single('file'), addSubmission);

// Get all submissions for a resource (Teacher)
router.get('/resource/:resourceId', teacherAuth, getSubmissionsByResource);

// Update marks for a submission (Teacher)
router.put('/marks/:submissionId', teacherAuth, updateSubmissionMarks);

// Get all submissions for a specific student (Student)
router.get('/student/:studentId', studentAuth, getSubmissionsByStudent);

// Get submission by ID
router.get('/submission/:submissionId', getSubmissionById);

// Route to mark obtained marks for a submission (Teacher)
router.put('/grade',teacherAuth, markSubmissionMarks);

module.exports = router;
