const bcrypt = require('bcryptjs');
const User = require('../../models/User'); // Assuming your User model points to 'users' collection
const Family = require('../../models/Family'); // Assuming your Family model points to 'families' collection
const Volunteer = require('../../models/Volunteer'); // Assuming your Volunteer model points to 'volunteers' collection
const Admin = require('../../models/Admin'); // Assuming your Admin model points to 'admins' collection
const { body, validationResult } = require('express-validator');

// Function to hash new password
const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

// Function to compare passwords
const comparePasswords = async (enteredPassword, storedPassword) => {
  return bcrypt.compare(enteredPassword, storedPassword);
};

exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword, Role, userId } = req.body;
  console.log(req.body);

  // Validation for password fields
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).send('All fields are required');
  }

  // Check if new password matches the confirmation
  if (newPassword !== confirmPassword) {
    return res.status(400).send('New password and confirm password do not match');
  }

  try {
    // Based on the role, find the user in the correct collection
    let user = null;
    switch (Role) {
      case 'Student':
        user = await User.findOne({ user_id: userId });
        // console.log('Student'); 
        break;
      case 'Teacher':
        user = await Volunteer.findOne({ employee_id: userId });
        break;
      case 'Admin':
        user = await Admin.findOne({ user_id: userId });
        break;
      case 'Family':
        user = await Family.findOne({ user_id: userId });
        break;
      default:
        return res.status(400).send('Invalid role');
    }

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Compare the current password with the stored password
    const isMatch = await comparePasswords(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).send('Current password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Use updateOne instead of save to avoid deleting records
    await user.updateOne({ password: hashedPassword });

    // Send response with the updated password (hashed)
    res.send({
      message: 'Password updated successfully',
      updatedPassword: hashedPassword // sending the hashed password as response
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
