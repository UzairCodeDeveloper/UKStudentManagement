const express = require('express');
const { updatePassword } = require('../../controller/UserProfileController/UserProfileController');
const adminAuth = require('../../middleware/adminAuth');
const familyAuth = require('../../middleware/familyAuth');
const studentAuth = require('../../middleware/studentAuth');
const volunteerAuth = require("../../middleware/volunteerAuth");
const router = express.Router();

// Middleware to dynamically select auth based on role
const roleAuth = (role) => {
  switch (role) {
    case 'Admin':
      return adminAuth;
    case 'Family':
      return familyAuth;
    case 'Student':
      return studentAuth;
    case 'Teacher':
      return volunteerAuth;
    default:
      return (req, res, next) => res.status(400).send('Invalid role');
  }
};

// Route to update password, using dynamic authentication middleware
router.put('/updatepassword', (req, res, next) => {
  const { Role } = req.body;  // Assuming the role is passed in the body
  const authMiddleware = roleAuth(Role);
  
  // Apply the correct authentication middleware based on the role
  authMiddleware(req, res, () => {
    // Once authenticated, proceed to update the password
    next();
  });
}, updatePassword);

module.exports = router;
