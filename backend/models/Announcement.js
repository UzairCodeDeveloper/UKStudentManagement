const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    announcementTo: {
        type: String,
        enum: ['ALL', 'STUDENT', 'TEACHER','FAMILY'],
        required: true,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course', // Optional: If the announcement is course-specific
    },
}, { timestamps: true });

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;
