const mongoose = require('mongoose');
const crypto = require('crypto');

// Create a separate schema for tracking family registration numbers
const familyRegNoSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
        // unique: true
    },
    reg_number: {
        type: Number,
        // required: true,
        default: 0
    }
});

const FamilyRegNo = mongoose.model('FamilyRegNo', familyRegNoSchema);

// Family Schema
const familySchema = new mongoose.Schema({
    familyRegNo: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        // required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Function to generate a random 6-digit alphanumeric password
function generatePassword() {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // Generates a 6-character alphanumeric string
}

// Pre-save hook to auto-generate familyRegNo
familySchema.pre('save', async function(next) {
    const currentYear = new Date().getFullYear();
    
    // Find or create family reg number entry for the current year
    let regEntry = await FamilyRegNo.findOne({ year: currentYear });
    if (!regEntry) {
        regEntry = new FamilyRegNo({ year: currentYear });
    }

    // Increment the family registration number
    regEntry.reg_number += 1;
    await regEntry.save();

    // Set the familyRegNo
    const prefix = "ISM"; // Desired prefix
const regNumber = regEntry.reg_number; // Registration number
const formattedRegNo = `${prefix}${String(regNumber).padStart(3, "0")}`; // Format: ISM###
this.familyRegNo = formattedRegNo;
    
    // Set password if not provided
    if (!this.password) {
        this.password = generatePassword();
    }

    next();
});

module.exports = mongoose.model('Family', familySchema);
