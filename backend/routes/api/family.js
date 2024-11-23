const express = require('express');
const router = express.Router();
const familyController = require('../../controller/FamilyController/FamilyController');
const adminAuth = require('../../middleware/adminAuth');

// Route to create a new family (POST)
router.post('/create',adminAuth, familyController.createFamily);

// Route to get all families (GET)
router.get('/',adminAuth, familyController.getAllFamilies);

// Route to get a family by its familyRegNo (GET)
router.get('/:familyRegNo',adminAuth, familyController.getFamilyByRegNo);

// Route to delete a family by ID (soft delete - update isActive to false) (DELETE)
router.delete('/delete/:familyId', familyController.deleteFamilyById);

module.exports = router;
