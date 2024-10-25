const express = require('express');
const router = express.Router();
const { uploadResource, getResourcesByCourse, deleteResource } = require('../../controller/TeacherControllers/ResourceController');
const { pdfUpload } = require('../../config/multerConfigPdf'); // Correctly destructure pdfUpload
const volunteerAuth = require('../../middleware/volunteerAuth'); // Assuming you use an auth middleware

// Upload a resource
router.post('/upload', volunteerAuth, pdfUpload.single('pdf'), uploadResource); // Use pdfUpload directly

// Get all resources for a specific course
router.get('/:course_id', volunteerAuth, getResourcesByCourse);

// Delete a resource by ID
router.delete('/:id', volunteerAuth, deleteResource);

module.exports = router;
