const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');


module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ errors: [{ msg: 'AUTHORIZATION DENIED | Token is missing' }] });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Find the User using the id from the decoded token
        const user = await User.findById(decoded.user.id);

        if (!user) {
            return res.status(401).json({ errors: [{ msg: 'User not found' }] });
        }

        // Attach the User id to req.user
        req.user = { id: decoded.user.id };
        next();

    } catch (err) {
        console.log(err.message);
        res.status(401).json({ errors: [{ msg: 'Token is not valid' }] });
    }
};
