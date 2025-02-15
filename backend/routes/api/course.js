const express = require("express");
const router = express.Router();
const adminAuth = require("../../middleware/adminAuth");
const volunteerAuth = require("../../middleware/volunteerAuth");
const studentAuth = require("../../middleware/studentAuth");

const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getAllTeacherCourses,
  getCourseByIdInstructor,
} = require("../../controller/CourseController/CourseController");

const { getAllStudentCourses } = require("../../controller/StudentController/CourseStudentController");

// @route POST /api/courses
// @desc Create a new course
// @access Public or Admin (depending on your authorization setup)
router.post("/create-course", adminAuth, createCourse);

// @route GET /api/courses
// @desc Get all courses
// @access Public or Admin (depending on your authorization setup)
router.get("/get-courses", adminAuth, getAllCourses);


// Get student Course
router.get("/student/get-courses/:id", studentAuth, getCourseById);

// @route GET /api/courses/:id
// @desc Get a course by ID
// @access Public or Admin (depending on your authorization setup)
router.get("/:id", adminAuth, getCourseById);

// @route PUT /api/courses/:id
// @desc Update a course by ID
// @access Admin
router.put("/:id", adminAuth, updateCourse);

// @route DELETE /api/courses/:id
// @desc Delete a course by ID
// @access Admin
router.delete("/:id", adminAuth, deleteCourse);

// InstructorAPIs
router.get("/my-courses/getALL", volunteerAuth, getAllTeacherCourses);
router.get("/my-courses/:id", volunteerAuth, getCourseByIdInstructor);

// router.get('/get-Students-enrolled/:id',volunteerAuth, getStudentsEnrolledInTheCourse);


// Student  APIs
router.get('/student/getALL', studentAuth, getAllStudentCourses);
module.exports = router;
