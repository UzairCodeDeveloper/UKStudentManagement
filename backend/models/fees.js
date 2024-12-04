const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    familyRegNo: {
        type: String,
        required: true,
        ref: 'Family', // This references the Family model
    },
    amountDue: {
        type: Number,
        required: true,
    },
    paidAmount: {
        type: Number,
        default: 0,
    },
    feeId: {
        type: String,
        default: 0,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('Fee', feeSchema);
