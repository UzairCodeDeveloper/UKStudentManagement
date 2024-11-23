const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth')


const {
    createAnnouncement,
    getAllAnnouncements,
    deleteAnnouncement,
} = require('../../controller/AnnouncementController/AnnouncementController');

// POST: Create a new session
router.post('/',adminAuth, createAnnouncement);

// GET: Fetch all sessions
router.get('/get-Announcements',adminAuth, getAllAnnouncements);



// DELETE: Delete a session by ID
router.delete('/delete/:id',adminAuth, deleteAnnouncement);

module.exports = router;
