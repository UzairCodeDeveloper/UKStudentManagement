const express = require('express');
const { getAllFees, updateFees,getDueAmount } = require('../../controller/FeesController/FeesController');
const adminAuth = require('../../middleware/adminAuth');
const familyAuth = require('../../middleware/familyAuth');
const router = express.Router();

// Get all fee records
router.get('/fees',adminAuth, getAllFees);

// Bulk update fees for all families
router.put('/fees',adminAuth, updateFees);
router.post('/familyfees', getDueAmount);

module.exports = router;
