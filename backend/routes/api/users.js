const express = require("express");
const router = express.Router();
const { check } = require("express-validator");


// Register Controller Function
const { registerUser, loginUser } = require("../../controller/Auth/UserController");
const adminAuth = require("../../middleware/adminAuth");



// @route       POST api/users/login
// @description LOGIN  user
// @access      Public
router.post(
    "/login",
    loginUser // Use controller function for user login
);



// @route       POST api/users
// @description Register new user
// @access      SHould be private and add admin middleware
router.post(
    "/:role",
    adminAuth,
    registerUser // Use controller function for user registration
);




module.exports = router;