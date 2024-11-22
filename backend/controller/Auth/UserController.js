const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");

// Importing Models
const User = require("../../models/User");
const Role = require("../../models/Role");
const Enrollment = require("../../models/Enrolment");
const Family = require("../../models/Family");
const Credentials = require("../../models/Credentials");

const registerUser = async (req, res) => {
    const {
        familyRegNo,    // Optional
        forename,
        surname,
        gender,
        dob,
        msuExamCertificate,
        doctorDetails,
        guardianDetails,
        interests,
        class_id,       // New field to get the class_id
        user_id,        // Existing user ID for the registration
        role            // Role of the user (student, guardian)
    } = req.body;

    try {
        // Validate role
        if (role !== "student" && role !== "guardian") {
            return res.status(400).json({ errors: [{ msg: "Invalid Role!" }] });
        }

        // Handle family logic
        let family;
        let isNewFamily = false;
        let generatedFamilyRegNo = "";
        let familyPassword = "";

        // Case 1: If familyRegNo is provided, check for the existing family
        if (familyRegNo) {
            family = await Family.findOne({ familyRegNo });

            // If family does not exist, create a new family record
            if (!family) {
                // Generate new familyRegNo
                family = new Family({ familyRegNo: `FAM-${Date.now()}` }); // Customize familyRegNo logic if needed
                await family.save();
                isNewFamily = true;
                generatedFamilyRegNo = family.familyRegNo;

                // Generate a random password for the new family
                familyPassword = Math.random().toString(36).slice(-6);
            } else {
                generatedFamilyRegNo = family.familyRegNo; // Use existing familyRegNo
            }
        } else {
            // Case 2: If no familyRegNo is provided, create a new family
            isNewFamily = true;
            family = new Family({ familyRegNo: `FAM-${Date.now()}` }); // Customize familyRegNo logic if needed
            await family.save();
            generatedFamilyRegNo = family.familyRegNo;

            // Generate a random password for the new family
            familyPassword = Math.random().toString(36).slice(-6);
        }

        // Create role object reference
        let roleObj = await Role.findOne({ name: role });
        if (!roleObj) {
            return res.status(400).json({ errors: [{ msg: "Role not found!" }] });
        }

        // Generate a random password for the user
        const password = Math.random().toString(36).slice(-6);

        // Create user instance with the provided data
        const user = new User({
            password,
            role: roleObj._id,
            isActive: true,
            isVerified: false,
            studentData: {
                familyRegNo: generatedFamilyRegNo, // Link the familyRegNo to the user
                forename,
                surname,
                gender,
                dob,
                msuExamCertificate,
                doctorDetails,
                guardianDetails,
                interests
            }
        });

        // Encrypt user password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to the database
        await user.save();

        // Save credentials to the Credentials table
        const credentials = new Credentials({
            username: user.user_id, // Use user_id as username
            password,
            student_id: user._id,
            familyRegNo: family._id, // Link family record
            isFamilyNumber: isNewFamily // Flag whether this is a new family or not
        });

        await credentials.save();

        // Create an enrollment entry for the user
        const enrollment = new Enrollment({
            student_id: user._id,
            class_id,
            fee_payment_method: 'monthly', // Or based on your logic
            due_date: Date.now(),
            status: 'due',
            enrollment_date: new Date()
        });

        await enrollment.save();

        // Prepare response payload
        const responsePayload = {
            msg: "User Registered Successfully",
            user_id: user.user_id,
            roll_number: user.roll_number,
            password,
            isNewFamily, // Whether this is a new family or not
            familyRegNo: generatedFamilyRegNo // Return the familyRegNo (new or existing)
        };

        // If it's a new family, include the generated family password
        if (isNewFamily) {
            responsePayload.familyPassword = familyPassword; // Include the family password for new families
        }

        // Create and return JWT token
        const payload = {
            user: {
                id: user.id,
                user_id: user.user_id,
                roll_number: user.roll_number
            }
        };

        jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 360000 }, // Adjust the expiration time if needed
            (err, token) => {
                if (err) throw err;
                res.json({ ...responsePayload, token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};



const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { user_id, password } = req.body;

        // Find user by user_id
        const user = await User.findOne({ user_id });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: "User not found" }] });
        }

        // Check if user has the student role
        const studentRole = await Role.findOne({ name: 'student' });
        if (!studentRole || !user.role.equals(studentRole._id)) {
            return res.status(403).json({ errors: [{ msg: "Access denied: Not a student" }] });
        }

        // Compare the entered password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: "Incorrect password" }] });
        }

        // Remove password from the user object before sending the response
        user.password = undefined;

        // Prepare JWT payload
        const payload = { user: { id: user.id } };

        // Sign JWT
        jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ errors: [{ msg: "Server Error" }] });
    }
};

const updatePassword = async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        // Find user by ID
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ errors: [{ msg: "User not found" }] });
        }

        // Log before update (for debugging)
        console.log('User before update:', user);

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Save the password history
        const passwordHistory = {
            oldPassword: user.password,
            updatedAt: moment().toISOString(),  // Save timestamp
        };

        // Update the password
        user.password = hashedPassword;
        user.passwordHistory.push(passwordHistory);  // Save history of password changes
        await user.save();  // Save the updated user

        // Log after update (for debugging)
        console.log('User after update:', user);

        // Respond back with success
        res.json({ msg: "Password updated successfully", user });
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).send('Server Error');
    }
};






const authenticateUser = async (req, res) => {
    try {
        // Find the user by ID and exclude the password field
        const user = await User.findById(req.user.id).select("-password");

        // Extract the role from the URL parameter
        const role = req.params.role;

        // Authorizing user based on role obtained from URL parameter
        const isAuthorized = await authorizeUser(user.role, role);
        if (isAuthorized) {
            // Return the user object with or without the medicalProfessionalStatus field
            res.json(user);
            //   logAction(user.id, "Logged in");
        } else {
            res.status(401).json({ errors: [{ msg: "User Not found!" }] });
            console.log("Unauthorized Access")
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ errors: [{ msg: "Server Error" }] });
    }
};


module.exports = {
    registerUser, loginUser, updatePassword
    // authenticateUser,
};


