// Importing MODEL(s)
const User = require("../../models/User");
const Role = require("../../models/Role");

const getAllStudents = async (req, res) => {
  try {
      const roleParam = req.params.role;
  
      // Validate that role is either 'student' or 'guardian'
      if (roleParam !== "student" && roleParam !== "guardian") {
          return res.status(400).json({ errors: [{ msg: "Invalid Role!" }] });
      }
  
      // Find the Role object based on the role name
      let roleObj = await Role.findOne({ name: roleParam });
      if (!roleObj) {
          return res.status(400).json({ errors: [{ msg: "This role does not exist in the database!" }] });
      }
  
      // Find users with the specified role and where isActive is true
      const users = await User.find({ role: roleObj._id, isActive: true }).select("-password");
  
      // Check if no users are found
      if (users.length === 0) {
          return res.status(404).json({ errors: [{ msg: "No active users found" }] });
      }
  
      // Return the active users found
      return res.status(200).json(users);
  } catch (err) {
      console.error(err.message);
      return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the ID is in the correct format (valid MongoDB ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ errors: [{ msg: "Invalid Student ID format" }] });
    }

    // Find the student by ID and ensure they have the 'student' role
    const student = await User.findOne({ _id: id});

    if (!student) {
      return res.status(404).json({ errors: [{ msg: "Student not found" }] });
    }

    // Soft delete: mark student as inactive (instead of deleting from the database)
    student.isActive = false;  // Use `isActive` as per your schema

    // Save the updated student status
    await student.save();

    return res.status(200).json({ msg: "Student marked as inactive successfully", student });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};




module.exports = { getAllStudents,deleteStudent };
