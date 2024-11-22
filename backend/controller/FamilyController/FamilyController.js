const Family = require('../../models/Family');

// Controller to create a new family
exports.createFamily = async (req, res) => {
    try {
        // const { password, isActive } = req.body;

        // Create a new family, password is auto-generated if not provided
        const newFamily = new Family();

        await newFamily.save();
        res.status(201).json({
            message: 'Family created successfully',
            family: newFamily,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating family' });
    }
};

// Controller to get all families
exports.getAllFamilies = async (req, res) => {
    try {
        const families = await Family.find({ isActive: true });
        res.status(200).json({
            message: 'Families retrieved successfully',
            families,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving families' });
    }
};

// Controller to get a specific family by familyRegNo
exports.getFamilyByRegNo = async (req, res) => {
    const { familyRegNo } = req.params;
    try {
        const family = await Family.findOne({ familyRegNo });
        if (!family) {
            return res.status(404).json({ message: 'Family not found' });
        }
        res.status(200).json({
            message: 'Family retrieved successfully',
            family,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving family' });
    }
};

// Controller to delete a family by ID (soft delete by setting isActive to false)
exports.deleteFamilyById = async (req, res) => {
    const { familyId } = req.params;
    try {
        const family = await Family.findById(familyId);
        if (!family) {
            return res.status(404).json({ message: 'Family not found' });
        }

        // Soft delete by setting isActive to false
        family.isActive = false;
        await family.save();

        res.status(200).json({
            message: 'Family deactivated successfully',
            family,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deactivating family' });
    }
};