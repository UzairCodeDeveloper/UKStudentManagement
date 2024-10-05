const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    profile_picture: {
        type: String
    },
    contact_details: {
        phone_number: {
            type: String,
        },
        address: {
            type: String,
        }
    },
    studentData: {
        forename: {
            type: String
        },
        surname: {
            type: String
        },
        gender: {
            type: String
        },
        dob: {
            type: Date
        },
        msuExamCertificate: [{
            certificateName: { type: String },
            certificateDate: { type: Date }
        }],
        doctorDetails: {
            doctorName: {
                type: String
            },
            doctorAddress: {
                type: String
            },
            gpSurgeryContact: {
                type: String
            },
            childAllergic: {
                type: Boolean
            },
            childAlergicDetail: {
                type: String
            },
            takeMedicine: {
                type: Boolean
            },
            takeMedicineDetail: {
                type: String
            },
            learningDifficulty: {
                type: Boolean
            },
            learningDifficultyDetail: {
                type: String
            },
            concernAware: {
                type: Boolean
            },
            concernAwareDetail: {
                type: String
            },
            medicalInfo: {
                type: String
            }
        },
        guardianDetails: {
            guardianName: {
                type: String
            },
            relationToChild: {
                type: String
            },
            guardianAddress: {
                type: String
            },
            primaryContactNumber: {
                type: String
            },
            secondaryContactNumber: {
                type: String
            }
        },
        interests: {
            hobbyInterest: {
                type: String
            },
            involvedInSport: {
                type: Boolean
            },
            fitForActivity: {
                type: Boolean
            }
        },
    }
});

module.exports = mongoose.model('User', userSchema);
