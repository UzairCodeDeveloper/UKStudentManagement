const mongoose = require('mongoose');


// Create a separate schema for tracking roll numbers
const rollNumberSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
        unique: true
    },
    roll_number: {
        type: Number,
        required: true,
        default: 0
    }
});

const RollNumber = mongoose.model('RollNumber', rollNumberSchema);

const userSchema = new mongoose.Schema({
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
    user_id: { // New field for formatted user ID
        type: String,
        unique: true
    },
    roll_number: { // New field for auto-incrementing roll number
        type: Number,
        unique: true
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
        
        msuExamCertificate: [
            {
                type:String
            }
        ],
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

// Pre-save hook to auto-increment roll_number and create user_id
userSchema.pre('save', async function(next) {
    const currentYear = new Date().getFullYear();
    
    // Find or create roll number entry for the current year
    let rollEntry = await RollNumber.findOne({ year: currentYear });
    if (!rollEntry) {
        rollEntry = new RollNumber({ year: currentYear });
    }

    // Increment the roll number
    rollEntry.roll_number += 1;
    await rollEntry.save();

    // Set the user_id and roll_number
    this.roll_number = rollEntry.roll_number;
    this.user_id = `${currentYear}-${String(rollEntry.roll_number).padStart(3, '0')}`; // Format: YYYY-XXX

    next();
});

module.exports = mongoose.model('User', userSchema);
