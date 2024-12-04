const Announcement = require('../../models/Announcement');  // Import the Announcement model

module.exports = {
    // Create Announcement
    createAnnouncement: async (req, res) => {
        try {
            const { title, description, date, announcementTo, course } = req.body;

            // Validate required fields
            if (!title || !description || !date || !announcementTo) {
                return res.status(400).json({ msg: 'All fields are required' });
            }

            // Create the announcement
            const newAnnouncement = new Announcement({
                title,
                description,
                date,
                announcementTo,
                course,  // optional, if needed
            });

            await newAnnouncement.save();
            res.status(201).json({ success: true, data: newAnnouncement });
        } catch (error) {
            console.error('Error creating announcement:', error.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    },

    // Get all Announcements
    getAllAnnouncements: async (req, res) => {
        try {
            const announcements = await Announcement.find().sort({ date: -1 });
            res.status(200).json({ success: true, data: announcements });
        } catch (error) {
            console.error('Error fetching announcements:', error.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    },

     getAnnouncementsForTeachers: async (req, res) => {
        try {
            // Get current date, month, and year
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth(); // 0-based index for months
            const currentYear = currentDate.getFullYear();
    
            // Create start and end dates for the month
            const startOfMonth = new Date(currentYear, currentMonth, 1);
            const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
    
            // Query the database for announcements in the current month/year and targeted to ALL or TEACHER
            const announcements = await Announcement.find({
                date: { $gte: startOfMonth, $lte: endOfMonth },
                announcementTo: { $in: ['ALL', 'TEACHER'] },
            }).sort({ date: -1 });
    
            // Respond with the fetched announcements
            res.status(200).json({ success: true, data: announcements });
        } catch (error) {
            console.error('Error fetching announcements for teachers:', error.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    },
    getAnnouncementsForFamily: async (req, res) => {
        try {
            // Get current date, month, and year
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth(); // 0-based index for months
            const currentYear = currentDate.getFullYear();
    
            // Create start and end dates for the month
            const startOfMonth = new Date(currentYear, currentMonth, 1);
            const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
    
            // Query the database for announcements in the current month/year and targeted to ALL or TEACHER
            const announcements = await Announcement.find({
                date: { $gte: startOfMonth, $lte: endOfMonth },
                announcementTo: { $in: ['ALL', 'FAMILY'] },
            }).sort({ date: -1 });
    
            // Respond with the fetched announcements
            res.status(200).json({ success: true, data: announcements });
        } catch (error) {
            console.error('Error fetching announcements for teachers:', error.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    },
    getAnnouncementsForStudent: async (req, res) => {
        try {
            // Get current date, month, and year
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth(); // 0-based index for months
            const currentYear = currentDate.getFullYear();
    
            // Create start and end dates for the month
            const startOfMonth = new Date(currentYear, currentMonth, 1);
            const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
    
            // Query the database for announcements in the current month/year and targeted to ALL or TEACHER
            const announcements = await Announcement.find({
                date: { $gte: startOfMonth, $lte: endOfMonth },
                announcementTo: { $in: ['ALL', 'STUDENT'] },
            }).sort({ date: -1 });
    
            // Respond with the fetched announcements
            res.status(200).json({ success: true, data: announcements });
        } catch (error) {
            console.error('Error fetching announcements for teachers:', error.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    },

    // Delete Announcement by ID
    deleteAnnouncement: async (req, res) => {
        try {
            const { id } = req.params;

            const announcement = await Announcement.findById(id);
            if (!announcement) {
                return res.status(404).json({ msg: 'Announcement not found' });
            }

            await announcement.remove();
            res.status(200).json({ success: true, msg: 'Announcement deleted successfully' });
        } catch (error) {
            console.error('Error deleting announcement:', error.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    },
};
