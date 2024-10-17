const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    course_name: {
        type: String,
        required: true,
    },
    course_description: {
        type: String,
    },
    is_active: {
        type: Boolean,
        default: true,
    },

    class_id: {
        type: Schema.Types.ObjectId,
        ref: 'Class', // Reference to the Class model
        required: true,
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'Volunteer', // Reference to the Volunteer model
        required: true,
    },
}, { timestamps: true });

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
