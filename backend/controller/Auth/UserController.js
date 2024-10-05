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



const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { 
      email, 
      password,
      forename,
      surname,
      gender,
      dob,
      msuExamCertificate,
      doctorDetails,
      guardianDetails,
      interests
  } = req.body;

  const roleParam = req.params.role;

  try {
      // Validate role
      if (roleParam !== "student" && roleParam !== "guardian") {
          return res.status(404).json({ errors: [{ msg: "Invalid Role!" }] });
      }

      // Check if user already exists
      let user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ errors: [{ msg: "User already exists!" }] });
      }

      // Find role ObjectId based on role name
      let roleObj = {};
      if (roleParam === "student") {
          roleObj = await Role.findOne({ name: "student" });
      } else if (roleParam === "guardian") {
          roleObj = await Role.findOne({ name: "guardian" });
      }

      if (!roleObj) {
          return res.status(400).json({ errors: [{ msg: "This role does not exist in the database!" }] });
      }

      // Create new user instance with assigned role ObjectId
      user = new User({
          email,
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

      // Remove password from response
      user.password = undefined;

      // Create and return the JWT payload
      const payload = {
          user: {
              id: user.id,
          },
      };

      jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: 9999999999999999 }, // Consider adjusting expiration
          (err, token) => {
              if (err) throw err;
              res.json({ msg: "User Registered Successfully", token, user });
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

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });

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


