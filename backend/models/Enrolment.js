const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const enrolmentSchema = new Schema({
    student_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    class_id: {
        type: Schema.Types.ObjectId,
        ref: 'Class', // Reference to the Class model
        required: true,
    },
    fee_payment_method: {
        type: String,
        enum: ['monthly', 'weekly', 'quarterly'],
        required: true,
    },
    due_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['paid', 'overdue', 'due'],
        required: true,
        default: 'due',
    },
    enrollment_date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });


module.exports = mongoose.model('Enrolment', enrolmentSchema);
