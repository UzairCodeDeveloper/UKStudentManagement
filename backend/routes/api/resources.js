const express = require('express');
const router = express.Router();
const { uploadResource, getResourcesByCourse, deleteResource,updateResource,getResourceById,getPreSignedUrlController } = require('../../controller/TeacherControllers/ResourceController');
const { pdfUpload } = require('../../config/multerConfigPdf'); // Correctly destructure pdfUpload
const volunteerAuth = require('../../middleware/volunteerAuth'); // Assuming you use an auth middleware
const studentAuth = require('../../middleware/studentAuth'); 
const { upload } = require('../../utils/FileMulter'); // Use the updated multer config


router.put('/getPresignedUrl',volunteerAuth,getPreSignedUrlController); 

router.put('/getPresignedUrlforStudent',studentAuth,getPreSignedUrlController); 
// Upload a resource
router.post('/upload', volunteerAuth, upload.single('pdf'), uploadResource); // Use pdfUpload directlyrectly

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
