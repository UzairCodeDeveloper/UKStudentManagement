const jwt = require('jsonwebtoken');
const config = require('config');
const Volunteer = require('../models/Volunteer');


module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ errors: [{ msg: 'AUTHORIZATION DENIED | Token is missing' }] });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Find the volunteer using the id from the decoded token
        const volunteer = await Volunteer.findById(decoded.volunteer.id);

        if (!volunteer) {
            return res.status(401).json({ errors: [{ msg: 'Volunteer not found' }] });
        }

        // Attach the volunteer id to req.user
        req.user = { id: decoded.volunteer.id };
        next();

    } catch (err) {
        console.log(err.message);
        res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
    }
};
