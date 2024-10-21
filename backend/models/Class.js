const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    class_name: {
        type: String,
        required: true,
        // unique: true // Ensure class names are unique
    },
    is_active: {
        type: Boolean,
        default: true
    },
    status: {  
        type: String,
        enum: ['active', 'completed', 'cancelled'], // Add more statuses as needed
        default: 'active'
    },
    
    session: {
        type: Schema.Types.ObjectId,
        ref: 'Session', // Reference to the Class model
        required: true,
    }
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;
