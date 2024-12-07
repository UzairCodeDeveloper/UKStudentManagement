const express = require('express');
const {fetchAllCredentials } = require('../../controller/PasswordController/PasswordController');
const adminAuth = require('../../middleware/adminAuth');
// const familyAuth = require('../../middleware/familyAuth');
const router = express.Router();

// Get all fee records
router.get('/security', adminAuth,fetchAllCredentials);





module.exports = router;
