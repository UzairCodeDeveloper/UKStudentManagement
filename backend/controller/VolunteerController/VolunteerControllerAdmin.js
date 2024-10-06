const Volunteer = require('../../models/Volunteer');
const Role = require('../../models/Role');

const bcrypt = require("bcryptjs");

// Function to auto-generate a 4-digit employee ID
const generateEmployeeId = async () => {
    const lastVolunteer = await Volunteer.findOne().sort({ employee_id: -1 }).select('employee_id');
    let newEmployeeId = '0001'; // Default to 0001 if no volunteers exist

    if (lastVolunteer) {
        const lastId = parseInt(lastVolunteer.employee_id, 10);
        newEmployeeId = String(lastId + 1).padStart(4, '0');
    }

    return newEmployeeId;
};

// Create a new volunteer (employee)
const createVolunteer = async (req, res) => {
    const { volunteer_details, password } = req.body;

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

        // Generate employee ID and hash the password
        const employee_id = await generateEmployeeId();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newVolunteer = new Volunteer({
            employee_id,
            role: role._id,
            volunteer_details,
            password: hashedPassword
        });

        await newVolunteer.save();

        // Return the actual password along with the volunteer details
        res.status(201).json({
            msg: 'Volunteer created successfully',
            volunteer: {
                employee_id: newVolunteer.employee_id,
                volunteer_details: newVolunteer.volunteer_details,
                password, // Returning the actual password as requested
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};


// Get all volunteers
const getVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find().populate('role');
        res.status(200).json(volunteers);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};


// Get volunteer by ID
const getVolunteerById = async (req, res) => {
    const { id } = req.params;

    try {

        if(!id){
            return res.status(400).json({ msg: 'Volunteer ID is required' });
        }
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ msg: 'Invalid volunteer ID' });
        }

        const volunteer = await Volunteer.findById(id).populate('role', 'name');
        if (!volunteer) {
            return res.status(404).json({ msg: 'Volunteer not found' });
        }
        res.status(200).json(volunteer);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server Error', error });
    }
};

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

    try {
        let volunteer = await Volunteer.findById(id);
        if (!volunteer) {
            return res.status(404).json({ msg: 'Volunteer not found' });
        }

        // Soft delete
        volunteer.volunteer_details.is_active = false; 
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
    getVolunteerById,
    updateVolunteer,
    deleteVolunteer
};
