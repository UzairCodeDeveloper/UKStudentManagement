const express = require('express');
const router = express.Router();
const { getBooksByRoleAndCourse } = require('../../controller/GetbookController/GetbookController');
const volunteerAuth = require('../../middleware/volunteerAuth');
const studentAuth = require('../../middleware/studentAuth');
// Use POST to send role and courseId in the request body
router.post('/books',volunteerAuth, getBooksByRoleAndCourse);

router.post('/Studentbooks',studentAuth, getBooksByRoleAndCourse);

module.exports = router;
