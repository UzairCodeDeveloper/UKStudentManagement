const express = require("express");
const router = express.Router();
const { check } = require("express-validator");


// Admin Controller 
const { registerAdmin, loginAdmin } = require("../../controller/Auth/AdminController");

// Admin Middleware
const adminAuth = require("../../middleware/adminAuth");



// @route       POST api/users/login
// @description LOGIN  user
// @access      Public
router.post(
    "/login",
    [
        check("username", "Please enter username").not().isEmpty(),
    ],
    loginAdmin // Use controller function for user login
);



// @route       POST api/users
// @description Register new user
// @access      SHould be private and add admin middleware
router.post(
    "/register",
    // adminAuth,
    [
        check("username", "Username is required").not().isEmpty(),
        check(
            "password",
            "Please enter a password with 6 or more characters"
        ).isLength({ min: 6 }),
    ],
    registerAdmin // Use controller function for user registration
);




module.exports = router;