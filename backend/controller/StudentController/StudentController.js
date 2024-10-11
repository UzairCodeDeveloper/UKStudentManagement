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
    
        // Find users with the specified role
        const users = await User.find({ role: roleObj._id }).select("-password");
    
        // Check if no users are found
        if (users.length === 0) {
            return res.status(404).json({ errors: [{ msg: "No Users Found" }] });
        }
    
        // Return the users found
        return res.status(200).json(users);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ errors: [{ msg: "Server Error" }] });
    }
};

module.exports = { getAllStudents };
