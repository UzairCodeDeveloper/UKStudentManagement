const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth')
const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } = require('../../controller/CourseController/CourseController');

// @route POST /api/courses
// @desc Create a new course
// @access Public or Admin (depending on your authorization setup)
router.post('/create-course',adminAuth, createCourse);

// @route GET /api/courses
// @desc Get all courses
// @access Public or Admin (depending on your authorization setup)
router.get('/get-courses',adminAuth, getAllCourses);

// @route GET /api/courses/:id
// @desc Get a course by ID
// @access Public or Admin (depending on your authorization setup)
router.get('/:id', getCourseById);

// @route PUT /api/courses/:id
// @desc Update a course by ID
// @access Admin
router.put('/:id',adminAuth, updateCourse);

// @route DELETE /api/courses/:id
// @desc Delete a course by ID
// @access Admin
router.delete('/:id',adminAuth, deleteCourse);

module.exports = router;
