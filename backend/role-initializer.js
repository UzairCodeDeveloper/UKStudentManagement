// In seed.js

const mongoose = require('mongoose');
const Role = require('./models/Role');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/LMS-UK', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define default roles
const defaultRoles = ['student', 'guardian','volunteer'];

// Function to seed roles
const seedRoles = async () => {
  try {
    // Check if roles already exist
    const existingRoles = await Role.find({ name: { $in: defaultRoles } });
    if (existingRoles.length === defaultRoles.length) {
      console.log('Roles already exist in the database.');
      return;
    }

    // Create roles that don't exist
    const rolesToCreate = defaultRoles.filter(roleName =>
      existingRoles.every(role => role.name !== roleName)
    );

    const createdRoles = await Role.create(
      rolesToCreate.map(roleName => ({ name: roleName }))
    );

    console.log('Default roles created:', createdRoles);
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    // Close MongoDB connection
    mongoose.disconnect();
  }
};

// Seed roles
seedRoles();
