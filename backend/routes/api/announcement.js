const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth')
const volunteerAuth = require("../../middleware/volunteerAuth");
const familyAuth = require('../../middleware/familyAuth');
const studentAuth = require('../../middleware/studentAuth'); 
const {
    createAnnouncement,
    getAllAnnouncements,
    deleteAnnouncement,
    getAnnouncementsForTeachers,
    getAnnouncementsForFamily,
    getAnnouncementsForStudent
} = require('../../controller/AnnouncementController/AnnouncementController');

// POST: Create a new session
router.put('/',adminAuth, createAnnouncement);


// Get Teacher Announcement
router.get('/teacher',volunteerAuth,getAnnouncementsForTeachers );

// Get family Announcement
router.get('/family',familyAuth,getAnnouncementsForFamily );

// Get Teacher Announcement
router.get('/student',studentAuth,getAnnouncementsForStudent );

// GET: Fetch all sessions
router.get('/get-Announcements',adminAuth, getAllAnnouncements);



// DELETE: Delete a session by ID
router.delete('/delete/:id',adminAuth, deleteAnnouncement);

module.exports = router;
