const Family = require('../../models/Family');
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require('../../models/User');
const Attendance = require('../../models/Attendance');
const mongoose = require('mongoose');



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



// Family login controller
exports.familyLogin = async (req, res) => {
    const { familyRegNo, password } = req.body;

    try {
        // Validate input
        if (!familyRegNo || !password) {
            return res.status(400).json({ errors: [{ msg: "Family Registration Number and Password are required" }] });
        }

        // Find the family by registration number
        const family = await Family.findOne({ familyRegNo });

        // Check if family exists and is active
        if (!family || !family.isActive) {
            return res.status(401).json({ errors: [{ msg: "Invalid credentials or inactive family account" }] });
        }

        // Validate password (plain-text comparison as requested)
        if (family.password !== password) {
            return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
        }

        // Generate JWT token
        const payload = {
            family: {
                id: family.id,
                familyRegNo: family.familyRegNo
            }
        };

        jwt.sign(
            payload,
            config.get("jwtSecret"),
            { expiresIn: "1h" }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ msg: "Login successful", token,familyRegNo });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.testController = async (req, res) => {

    try {
        res.json({ msg: "Family login successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.getStudentsByFamily = async (req, res) => {
    try {
        if (!req.family || !req.family.id) {
            return res.status(400).json({ msg: 'Family data is missing or token is invalid' });
        }

        // Now it's safe to use req.family.id
        const students = await User.find({ 'studentData.familyRegNo': req.family.familyRegNo });
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getAttendanceByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Validate student_id format
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: "Invalid student ID format" });
        }

        // Fetch attendance records where the student_id exists in the attendance array
        const attendanceRecords = await Attendance.find({
            "attendance.student_id": studentId, // Match documents where the student_id exists in attendance array
        }).lean(); // Convert to plain JS objects for easier manipulation

        // Filter attendance array to include only the specific student_id
        const filteredAttendance = attendanceRecords.map((record) => ({
            ...record,
            attendance: record.attendance.filter(
                (entry) => entry.student_id.toString() === studentId
            ),
        }));

        return res.status(200).json({
            message: "Attendance retrieved successfully",
            attendance: filteredAttendance,
        });
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return res.status(500).json({
            message: "Error retrieving attendance",
            error: error.message,
        });
    }
};


exports.addAbsentReason = async (req, res) => {
    const { attendanceId, studentId } = req.params;
    const { reason_for_leave} = req.body;

    try {
        const attendanceRecord = await Attendance.findById(attendanceId);

        if (!attendanceRecord) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        const studentAttendance = attendanceRecord.attendance.find(
            (attendance) => attendance.student_id.toString() === studentId
        );

        if (!studentAttendance) {
            return res.status(404).json({ message: 'Student not found in this attendance record' });
        }

        // Update the absent reason and behaviour marks
        studentAttendance.reason_for_leave = reason_for_leave || studentAttendance.reason_for_leave;

        await attendanceRecord.save();

        res.status(200).json({
            message: 'Absent reason updated successfully',
            // attendance: attendanceRecord
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error updating absent reason' });
    }
};
