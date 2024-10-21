const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    session_year: {
        type: String,
        required: true,
        unique: true,
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
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
    }
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
