const mongoose = require('mongoose');

// Define the admin schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  forename: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  last_login: {
    type: Date,  // Store as a UNIX timestamp (in milliseconds)
    default: () => Date.now() // Default value is the current time
  },
  profile_picture: {
    type: String,
    default: ''  // You can provide a default value or leave it as empty
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt timestamps
});

// Create the model from the schema
const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
