const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String, // e.g., 'present', 'absent', 'late'
        required: true,
    },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
