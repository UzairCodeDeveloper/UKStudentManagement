const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    resource: {
        type: Schema.Types.ObjectId,
        ref: 'Resource', 
        required: true,
    },
    student_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    submission_url: {
        type: String, 
        required: true,
    },
    obtained_marks: {
        type: Number, 
        default: null, 
    },
    status: {
        type: String, 
        enum: ['PENDING', 'SUBMITTED','GRADED', 'REJECTED'], 
        default: 'PENDING', 
    },
}, { timestamps: true });

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
