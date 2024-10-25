const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const resourceSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course', // Reference to the Course model
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    due_date: {
        type: Date
    },
    resource_type: {
        type: String,
        enum: ['BOOK', 'ASSIGNMENT', 'SYLLABUS', 'HOMEWORK', 'OTHERS'], // Allowed types of resources
        required: true,
    },
    resource_url: {
        type: String,
        // required: true, // This will store the Cloudinary URL
    },
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;