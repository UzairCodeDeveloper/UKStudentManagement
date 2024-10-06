const express = require('express');
const router = express.Router();
const { createVolunteer, getVolunteers, updateVolunteer, deleteVolunteer,getVolunteerById } = require('../../controller/VolunteerController/VolunteerControllerAdmin');
const adminAuth = require('../../middleware/adminAuth');

// Create a volunteer
router.post('/',adminAuth, createVolunteer);

// Get all volunteers
router.get('/get-all',adminAuth, getVolunteers);

// Route to get volunteer by ID
router.get('/get/:id', getVolunteerById);


// Update volunteer by ID
router.put('/:id',adminAuth, updateVolunteer);

// Soft delete a volunteer (Deactivate)
router.delete('/delete/:id',adminAuth, deleteVolunteer);

module.exports = router;
