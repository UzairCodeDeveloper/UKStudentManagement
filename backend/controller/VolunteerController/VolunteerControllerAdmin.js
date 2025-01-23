const Volunteer = require('../../models/Volunteer');
const Role = require('../../models/Role');

const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// Function to generate a random 8-character alphanumeric password
const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Function to auto-generate a 4-digit employee ID
const generateEmployeeId = async () => {
    const lastVolunteer = await Volunteer.findOne().sort({ employee_id: -1 });
    let newEmployeeId = '0001'; // Default to 0001 if no volunteers exist
    if (lastVolunteer) {
        const lastId = parseInt(lastVolunteer.employee_id);
        newEmployeeId = String(lastId + 1).padStart(4, '0');
    }
    return newEmployeeId;
};

// Create a new volunteer (employee)
const createVolunteer = async (req, res) => {
    const { volunteer_details, already_teacher, interest_in_joining } = req.body; // Destructure these new fields from the request body

    try {
        const role = await Role.findOne({ name: 'volunteer' });
        if (!role) {
            return res.status(400).json({ msg: 'Role not found' });
        }

        // Check if the contact number already exists
        const contactExists = await Volunteer.findOne({ 'volunteer_details.contact_number': volunteer_details.contact_number });
        if (contactExists) {
            return res.status(400).json({ msg: 'Contact number already exists' });
        }

        // Generate employee ID and password
        const employee_id = await generateEmployeeId();
        const password = generatePassword(); // Generate the password
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        // Create new volunteer object with the additional fields
        const newVolunteer = new Volunteer({
            employee_id,
            role: role._id,
            volunteer_details,
            already_teacher, // Include the already_teacher field
            interest_in_joining, // Include the interest_in_joining field
            password: hashedPassword
        });

        await newVolunteer.save();

        // Return the actual password along with the volunteer details
        res.status(201).json({
            msg: 'Volunteer created successfully',
            volunteer: {
                employee_id: newVolunteer.employee_id,
                volunteer_details: newVolunteer.volunteer_details,
                already_teacher: newVolunteer.already_teacher, // Return this field in the response
                interest_in_joining: newVolunteer.interest_in_joining, // Return this field in the response
                password // Returning the actual password as requested
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};


// Volunteer Login
const loginVolunteer = async (req, res) => {
    // console.log(req)
    try {
        // Extract employee_id and password from request body
        const { employee_id, password } = req.body;

        // Check if employee_id and password are provided
        if (!employee_id || !password) {
            return res.status(400).json({ msg: 'Please provide both employee ID and password' });
        }

        // Find the volunteer by employee_id
        const volunteer = await Volunteer.findOne({ employee_id });
        if (!volunteer) {
            return res.status(400).json({ msg: 'Volunteer not found' });
        }

        // Check if the volunteer is active
        if (!volunteer.volunteer_details.is_active) {
            return res.status(403).json({ msg: 'Volunteer is deactivated' });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, volunteer.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        // Prepare JWT payload
        const payload = { volunteer: { id: volunteer._id } };

        // Sign JWT and return token along with volunteer details
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 }, // Token expiry set to 100 hours (adjust as needed)
            (err, token) => {
                if (err) throw err;

                // Remove password from response
                volunteer.password = undefined;

                res.status(200).json({
                    msg: 'Login successful',
                    token,
                    volunteer: {
                        employee_id: volunteer.employee_id,
                        volunteer_details: volunteer.volunteer_details,
                        volunteer_id:volunteer._id
                    }
                });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all volunteers
const getVolunteers = async (req, res) => {
    try {
        // Find all volunteers where is_active is true and populate their 'role' details
        const volunteers = await Volunteer.find({ 'volunteer_details.is_active': true })
            .populate('role', 'name'); // Assuming 'name' is the field in Role schema

        // If no active volunteers are found, return a 404
        if (!volunteers || volunteers.length === 0) {
            return res.status(404).json({ msg: 'No active volunteers found' });
        }

        // Return the active volunteers
        res.status(200).json(volunteers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Get volunteer by ID
// const getVolunteerById = async (req, res) => {
//     const { id } = req.params;

//     try {
//         // Check if ID is provided
//         if (!id) {
//             return res.status(400).json({ msg: 'Volunteer ID is required' });
//         }

//         // Validate if ID is a valid MongoDB ObjectID
//         if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//             return res.status(400).json({ msg: 'Invalid volunteer ID' });
//         }

//         // Fetch the volunteer by ID and populate the 'role' field
//         const volunteer = await Volunteer.findById(id);
        
//         // Check if the volunteer exists
//         if (!volunteer) {
//             return res.status(404).json({ msg: 'Volunteer not found' });
//         }

//         // Return the volunteer object, which should include _id by default
//         return res.status(200).json(volunteer);

//     } catch (error) {
//         console.error(error.message);
//         return res.status(500).json({ msg: 'Server Error', error });
//     }
// };


// Update volunteer by ID
const updateVolunteer = async (req, res) => {
    const { id } = req.params;
    const { role, volunteer_details } = req.body;

    try {
        let volunteer = await Volunteer.findById(id);
        if (!volunteer) {
            return res.status(404).json({ msg: 'Volunteer not found' });
        }

        // Update fields
        volunteer.role = role || volunteer.role;
        volunteer.volunteer_details = volunteer_details || volunteer.volunteer_details;
        volunteer.volunteer_details.is_active = true;

        await volunteer.save();
        res.status(200).json({ msg: 'Volunteer updated successfully', volunteer });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};



// Soft Delete (set is_active to false) for Volunteer by ID
const deleteVolunteer = async (req, res) => {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: 'Invalid volunteer ID format' });
    }

    try {
        // Find the volunteer by ID
        let volunteer = await Volunteer.findById(id);
        if (!volunteer) {
            return res.status(404).json({ msg: 'Volunteer not found' });
        }

        // Check if volunteer_details and is_active exist and update is_active
        if (volunteer.volunteer_details && 'is_active' in volunteer.volunteer_details) {
            volunteer.volunteer_details.is_active = false;

            // Explicitly mark the nested path as modified if needed
            volunteer.markModified('volunteer_details.is_active');
        } else {
            return res.status(400).json({ msg: 'Volunteer details or is_active field not found' });
        }

        // Save the updated volunteer object
        await volunteer.save();

        res.status(200).json({ msg: 'Volunteer deactivated successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};






module.exports = {
    createVolunteer,
    getVolunteers   ,
    
    updateVolunteer,
    deleteVolunteer,
    loginVolunteer
};
