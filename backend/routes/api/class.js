const express = require('express');
const router = express.Router();
const {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass
} = require('../../controller/ClassController/ClassController');

const adminAuth = require("../../middleware/adminAuth")

// Route to create a new class (POST)
router.post('/create-class',adminAuth, createClass);

// Route to get all classes (GET)
router.get('/all-classes',adminAuth, getAllClasses);

// Route to get a class by ID (GET)
router.get('/find-class/:id',adminAuth, getClassById);

// Route to update a class by ID (PUT)
router.put('/update-class/:id',adminAuth, updateClass);

// Route to mark a class as inactive (DELETE - soft delete)
router.delete('/class/:id',adminAuth, deleteClass);

module.exports = router;
