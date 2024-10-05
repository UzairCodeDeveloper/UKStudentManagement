const jwt = require('jsonwebtoken');
const config = require('config');


const Admin = require('../models/Admin');


// Middleware to check if user is an admin  
module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check token
    if (!token) {
        return res.status(401).json({ errors: [{ msg: 'AUTHORIZATION DENIED | Token is missing' }] });
    }
    // verify Token
    try {
        // Verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        // console.log(decoded)

        // Check if user is verified
        const admin = await Admin.findById(decoded.admin.id);

        if (!admin) {
            return res.status(401).json({ errors: [{ msg: 'Admin not found' }] });
        }

        // Return the user object with or without the medicalProfessionalStatus field
        req.user = decoded.user;
        next();
        // logAction(user.id, "Admin Logged in");


    } catch (err) {
        console.log(err.message);
        res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
    }
}
