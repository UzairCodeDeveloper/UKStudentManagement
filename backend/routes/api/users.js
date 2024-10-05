const express = require("express");
const router = express.Router();
const { check } = require("express-validator");


// Register Controller Function
const { registerUser, loginUser } = require("../../controller/Auth/UserController");



// @route       POST api/users/login
// @description LOGIN  user
// @access      Public
router.post(
    "/login",
    [
        check("email", "Please include valid email").isEmail(),
        check(
            "password",
            "Please enter a password with 6 or more characters"
        ).isLength({ min: 6 }),
    ],
    loginUser // Use controller function for user login
);



// @route       POST api/users
// @description Register new user
// @access      SHould be private and add admin middleware
router.post(
    "/:role",
    [
        check("name", "Name is required").not().isEmpty(),
        check("email", "Please include valid email").isEmail(),
        check(
            "password",
            "Please enter a password with 6 or more characters"
        ).isLength({ min: 6 }),
    ],
    registerUser // Use controller function for user registration
);




module.exports = router;