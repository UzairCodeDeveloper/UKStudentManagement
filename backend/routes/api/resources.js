const express = require('express');
const router = express.Router();
const { uploadResource, getResourcesByCourse, deleteResource,updateResource,getResourceById } = require('../../controller/TeacherControllers/ResourceController');
const { pdfUpload } = require('../../config/multerConfigPdf'); // Correctly destructure pdfUpload
const volunteerAuth = require('../../middleware/volunteerAuth'); // Assuming you use an auth middleware
const studentAuth = require('../../middleware/studentAuth'); 

// Upload a resource
router.post('/upload', volunteerAuth, pdfUpload.single('pdf'), uploadResource); // Use pdfUpload directly

// Get all resources for a specific course
router.get('/:course_id', volunteerAuth, getResourcesByCourse);
// Get all resources for a student
router.get('/student-resources/:course_id', studentAuth, getResourcesByCourse);

// Delete a resource by ID
router.delete('/:id', volunteerAuth, deleteResource);
router.get('/get/:id', volunteerAuth, getResourceById);

// Update a resource by ID
router.put('/update/:id', volunteerAuth, updateResource); // PUT request to update



// Get and refine resource by ID
router.get('/:id/refine',studentAuth,    getResourceById);


// Grade a resource by ID
// router.put('/:id/grade', resourceController.gradeResource);


module.exports = router;
