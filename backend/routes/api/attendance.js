const express = require('express');
const router = express.Router();
const announcementController = require('../../controllers/announcementController');

// POST - Create announcement
router.post('/add', announcementController.createAnnouncement);

// GET - Get all announcements
router.get('/', announcementController.getAllAnnouncements);

// DELETE - Delete announcement by ID
router.delete('/:id', announcementController.deleteAnnouncement);

module.exports = router;
