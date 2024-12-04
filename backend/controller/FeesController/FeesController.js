const Fee = require('../../models/fees');
const Family = require('../../models/Family');

// Fetch all fee records or return families with amount 0
exports.getAllFees = async (req, res) => {
    try {
        // Fetch all fee records
        const fees = await Fee.find();
  
        // Fetch all active families
        const families = await Family.find({ isActive: true }).select('familyRegNo familyName _id');
  
        // Map through families and find their corresponding fee record if exists
        const feeData = families.map((family) => {
            // Try to find the fee for the current family
            const familyFee = fees.find((fee) => fee.familyRegNo === family.familyRegNo);
  
            return {
                id: family._id, // Use the unique family _id as the object ID
                familyRegNo: family.familyRegNo, // Keep the familyRegNo as is
                paidAmount: familyFee ? familyFee.paidAmount : 0, // If fee exists, return paidAmount, otherwise 0
                amountDue: familyFee ? familyFee.amountDue : 0, // If fee exists, return dueAmount, otherwise 0

            };
        });
  
        res.status(200).json({
            message: 'Fees retrieved successfully',
            families: feeData, // Return the families array with fee info
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving fees' });
    }
};

// Update or create fee records
exports.updateFees = async (req, res) => {
    try {
        const { feeUpdates } = req.body;
        console.log(feeUpdates);

        // Iterate over the feeUpdates array to either update or insert records
        for (const update of feeUpdates) {
            const { familyRegNo, paidAmount, dueAmount } = update;

            // Validate familyRegNo, paidAmount, and dueAmount
            if (!familyRegNo || paidAmount === undefined || dueAmount === undefined) {
                return res.status(400).json({ message: 'familyRegNo, paidAmount, and dueAmount are required.' });
            }

            // Try to find the existing fee record by familyRegNo
            const existingFee = await Fee.findOne({ familyRegNo });

            if (existingFee) {
                // If record exists, update it
                existingFee.paidAmount = paidAmount;
                existingFee.amountDue = dueAmount; // Update the due amount
                existingFee.isPaid = paidAmount > 0;

                await existingFee.save(); // Save the updated record
                console.log(`Fee for familyRegNo ${familyRegNo} was updated.`);
            } else {
                // If no record found, create a new one
                const newFee = new Fee({
                    familyRegNo,
                    paidAmount,
                    amountDue: dueAmount, // Set dueAmount for the new record
                    isPaid: paidAmount > 0,
                    dueDate: new Date(), // You can set a specific due date here if needed
                });

                await newFee.save(); // Save the new fee record
                console.log(`Fee for familyRegNo ${familyRegNo} was created.`);
            }
        }

        // Return success message
        res.status(200).json({ message: 'Fees updated or created successfully.' });
    } catch (error) {
        console.error('Error updating fees:', error);
        res.status(500).json({ message: 'Error updating fees.' });
    }
};
exports.getDueAmount = async (req, res) => {
    try {
        const { familyRegNo } = req.body; // Extract from request body
        console.log(familyRegNo);

        if (!familyRegNo) {
            return res.status(400).json({ message: 'Family registration number is required.' });
        }

        const feeRecord = await Fee.findOne({ familyRegNo });

        if (!feeRecord) {
            return res.status(404).json({ message: 'No fee record found for the provided registration number.' });
        }

        res.status(200).json({
            familyRegNo: feeRecord.familyRegNo,
            amountDue: feeRecord.amountDue,
        });
    } catch (error) {
        console.error('Error fetching due amount:', error);
        res.status(500).json({ message: 'Error fetching due amount.' });
    }
};
