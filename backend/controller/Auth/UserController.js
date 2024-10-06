const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");

// Authorization Controller
// const { authorizeUser } = require("./AuthorizationController");

// Log Controller
// const { logAction } = require("./LogController");

// Importing MODEL(s)
const User = require("../../models/User");
const Role = require("../../models/Role");
const Enrollment = require("../../models/Enrolment");



const registerUser = async (req, res) => {
    const { 
        forename,
        surname,
        gender,
        dob,
        msuExamCertificate,
        doctorDetails,
        guardianDetails,
        interests,
        class_id // New field to get the class_id
    } = req.body;

    const roleParam = req.params.role;

    try {
        // Validate role
        if (roleParam !== "student" && roleParam !== "guardian") {
            return res.status(404).json({ errors: [{ msg: "Invalid Role!" }] });
        }

        // Check if user already exists
        let user = await User.findOne({ forename, surname, dob }); // Use personal details to check for duplicates
        if (user) {
            return res.status(400).json({ errors: [{ msg: "User already exists!" }] });
        }

        // Find role ObjectId based on role name
        let roleObj = await Role.findOne({ name: roleParam });
        if (!roleObj) {
            return res.status(400).json({ errors: [{ msg: "This role does not exist in the database!" }] });
        }

        // Generate a random alphanumeric password
        const password = Math.random().toString(36).slice(-6); // 6 characters

        // Create new user instance with assigned role ObjectId
        user = new User({
            password,
            isActive: true,
            isVerified: false,
            role: roleObj._id, // Assign the role ObjectId to the user
            studentData: {
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

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        // Create an entry in the enrollment table
        const enrollment = new Enrollment({
            student_id: user._id, // Reference to the user
            class_id: class_id, // Assuming you have a class model
            fee_payment_method: 'monthly', // Default or based on your logic
            due_date: Date.now(), // You need to define how to calculate due dates
            status: 'due',
            enrollment_date: new Date()
        });

        await enrollment.save();

        // Remove password from response
        // user.password = undefined;

        // Create and return the JWT payload
        const payload = {
            user: {
                id: user.id,
                user_id: user.user_id, // Include user_id in the payload
                roll_number: user.roll_number // Include roll_number in the payload if needed
            },
        };

        jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: 9999999999999999 }, // Consider adjusting expiration
            (err, token) => {
                if (err) throw err;
                res.json({ msg: "User Registered Successfully", token, user_id: user.user_id, roll_number: user.roll_number, password:password });
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


module.exports = { registerUser, loginUser
    // authenticateUser,
 };


