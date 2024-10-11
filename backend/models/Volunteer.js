const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const volunteerSchema = new Schema({
    employee_id: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role', // Foreign key referencing Role model
        required: true,
    },
    volunteer_details: {
        full_name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        is_active: {
            type: Boolean,
            default: true
        },
        contact_number: {
            type: String,
            required: true,
            unique: true // Ensure phone number uniqueness
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'], 
            required: true
        },
        dob: {
            type: Date,
            required: true
        },
        postal_code: {
            type: String,
            required: true
        },
        working_commitment: {
            type: String,
            required: true
        },
        schedule: {
            type: String,
            required: true
        },
        days_to_commit: [{
            type: String, 
            required: true
        }],
        areas_of_working: [{
            type: String,
            required: true
        }],
        age_group: [{
            type: String,
            required: true
        }],
        qualification: {
            previous_experience: {
                type: Boolean,
                required: true
            },
            previous_experience_detail: {
                type: String,
            },
            first_aid_qualified: {
                type: Boolean,
                required: true
            },
            first_aid_certificate: {
                type: String,
                default: null // Optional field
            },
            brief_details: {
                type: String,
                required: true
            }
        }
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);
module.exports = Volunteer;
