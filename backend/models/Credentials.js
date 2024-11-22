const mongoose = require('mongoose');
const credentialsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
    ,
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    familyRegNo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Family'
    },
    isFamilyNumber: {
        type: Boolean,
        default: false
    },
    isStudent: {
        type: Boolean,
        default: false
    },




}, timestamp = true);


module.exports = mongoose.model('Credentials', credentialsSchema);
