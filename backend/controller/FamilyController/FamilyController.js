const Family = require('../../models/Family');
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require('../../models/User');
const Attendance = require('../../models/Attendance');
const mongoose = require('mongoose');
const Submission = require("../../models/Submission");
const Resource = require("../../models/Resource");
const Course = require("../../models/Course");


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
        // Retrieve all active families
        const families = await Family.find({ isActive: true }).select('familyRegNo');

        res.status(200).json({
            success: true,
            message: 'Families retrieved successfully',
            families,
        });
    } catch (error) {
        console.error('Error retrieving families:', error.message);
        res.status(500).json({ success: false, message: 'Error retrieving families' });
    }
};


// exports.getAllFamilies = async (req, res) => {
//     try {
//         // Retrieve only the familyRegNo field for active families
//         const families = await Family.find({ isActive: true }).select('familyRegNo');

//         res.status(200).json({
//             message: 'Families retrieved successfully',
//             families,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error retrieving families' });
//     }
// };


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

        // Fetch students based on the family registration number
        const students = await User.find(
            { 'studentData.familyRegNo': req.family.familyRegNo }, 
            '_id studentData forename surname roll_number'
        );

        // Return the students with the required fields
        res.json({ students });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server error' });
    }
};



// Controller to fetch absentees and their attendance details
// exports.checkAbsentees = async (req, res) => {
//   try {
//     const { studentIds } = req.body;  // The list of studentIds passed in the request body

//     // Ensure studentIds is a valid array and is not empty
//     if (!Array.isArray(studentIds) || studentIds.length === 0) {
//       return res.status(400).json({ message: 'Please provide a valid array of studentIds.' });
//     }

//     // Log studentIds to verify the incoming request data
//     console.log('Received student IDs:', studentIds);

//     // Convert string studentIds to ObjectId if needed
//     const studentObjectIds = studentIds.map(id => {
//       if (!mongoose.Types.ObjectId.isValid(id)) {
//         console.error(`Invalid ObjectId: ${id}`);
//         throw new Error(`Invalid ObjectId: ${id}`);
//       }
//       // Use createFromHexString to avoid TypeError with latest Mongoose versions
//       return mongoose.Types.ObjectId.createFromHexString(id);
//     });

//     // Fetch absentee records for the provided studentIds
//     const absenteeRecords = await Attendance.aggregate([
//       {
//         $match: {
//           'attendance.student_id': { $in: studentObjectIds },  // Match the student IDs in the attendance records
//           'attendance.status': 'absent',  // Ensure the attendance status is 'absent'
//           'attendance.reason_for_leave': { $in: [null, ''] }  // Reason for leave is null or empty
//         }
//       },
//       {
//         $unwind: '$attendance'  // Unwind the attendance array to access each student's attendance
//       },
//       {
//         $match: {
//           'attendance.status': 'absent',  // Ensure the status is absent for the student
//           'attendance.reason_for_leave': { $in: [null, ''] }  // Ensure reason for leave is empty or null
//         }
//       },
//       {
//         $match: {
//           'attendance.student_id': { $in: studentObjectIds }  // Filter only for provided student IDs
//         }
//       },
//       {
//         $lookup: {
//           from: 'users',  // Assuming you have a 'users' collection for student data
//           localField: 'attendance.student_id',
//           foreignField: '_id',
//           as: 'student'
//         }
//       },
//       {
//         $unwind: '$student'  // Unwind the student array after lookup
//       },
//       {
//         $project: {
//           studentId: '$attendance.student_id',  // Return the student ID
//           studentName: { $concat: ['$student.firstName', ' ', '$student.lastName'] },  // Concatenate first and last name
//           attendanceId: '$_id',  // Attendance record ID
//           absentDate: '$date'  // Assuming 'date' is the field storing the absence date
//         }
//       }
//     ]);

//     // If no absentee records found, return a 404 error
//     if (absenteeRecords.length === 0) {
//       return res.status(404).json({ message: 'No absentee records found for the given students.' });
//     }

//     // Return the absentee records
//     return res.status(200).json(absenteeRecords);
//   } catch (error) {
//     // Log error to console for debugging
//     console.error(error);
    
//     // Return a 500 error response in case of unexpected issues
//     return res.status(500).json({ message: 'Error fetching absentee records.' });
//   }
// };




exports.checkAbsentees = async (req, res) => {
    try {
      const studentIds = req.body;  // No need to extract from 'studentIds'
  
      // Ensure studentIds is a valid array and is not empty
      if (!Array.isArray(studentIds) || studentIds.length === 0) {
        return res.status(400).json({ message: 'Please provide a valid array of studentIds.' });
      }
  
      // Log studentIds to verify the incoming request data
      console.log('Received student IDs:', studentIds);
  
      // Convert string studentIds to ObjectId if needed
      const studentObjectIds = studentIds.map(id => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          console.error(`Invalid ObjectId: ${id}`);
          throw new Error(`Invalid ObjectId: ${id}`);
        }
        // Use createFromHexString to avoid TypeError with latest Mongoose versions
        return mongoose.Types.ObjectId.createFromHexString(id);
      });
  
      // Fetch absentee records for the provided studentIds
      const absenteeRecords = await Attendance.aggregate([
        {
          $match: {
            'attendance.student_id': { $in: studentObjectIds },
            'attendance.status': { $in: ['absent', 'late'] }, // Check for both absent and late
            'attendance.reason_for_leave': { $in: [null, ''] } // Reason is null or empty
          }
        },
        {
          $unwind: '$attendance' // Unwind the attendance array
        },
        {
          $match: {
            'attendance.student_id': { $in: studentObjectIds },
            'attendance.status': { $in: ['absent', 'late'] }, // Check for both absent and late
            'attendance.reason_for_leave': { $in: [null, ''] } // Reason is null or empty
          }
        },
        {
          $lookup: {
            from: 'users', // Assuming the collection for student details is 'users'
            localField: 'attendance.student_id',
            foreignField: '_id',
            as: 'student'
          }
        },
        {
          $unwind: '$student' // Unwind the student array
        },
        {
          $project: {
            studentId: '$attendance.student_id', // Student ID
            studentName: { $concat: ['$student.firstName', ' ', '$student.lastName'] }, // Full name
            attendanceId: '$_id', // Attendance record ID
            absentDate: '$date', // Date of absence/late
            status: '$attendance.status' // Status (absent/late)
          }
        },
        {
          $sort: { absentDate: -1 } // Sort by the date, most recent first
        }
      ]);
      
  
      // If no absentee records found, return a 404 error
      if (absenteeRecords.length === 0) {
        // return res.status(404).json({ message: 'No absentee records found for the given students.' });
      }
  
      // Return the absentee records
      return res.status(200).json(absenteeRecords);
    } catch (error) {
      // Log error to console for debugging
      console.error(error);
      
      // Return a 500 error response in case of unexpected issues
      return res.status(500).json({ message: 'Error fetching absentee records.' });
    }
  };

// exports.updateReasonOfLeave = async (req, res) => {
//   try {
//     const { attendanceDetails } = req.body;

//     console.log('Received attendance details:', attendanceDetails);  // Log to verify

//     // Ensure that attendanceDetails is an array and contains data
//     if (!Array.isArray(attendanceDetails) || attendanceDetails.length === 0) {
//       return res.status(400).json({ message: 'Please provide valid attendance details.' });
//     }

//     const updatedRecords = [];

//     // Loop through each record in attendanceDetails
//     for (let detail of attendanceDetails) {
//       const { attendanceId, studentId, reason_for_leave } = detail;

//       if (!attendanceId || !studentId || !reason_for_leave) {
//         console.log('Missing fields in record:', detail);  // Log missing fields
//         continue; // Skip if any required field is missing
//       }

//       // Try to update the attendance record
//       const updatedAttendance = await Attendance.findOneAndUpdate(
//         { _id: attendanceId, studentId: studentId },  // Match both attendanceId and studentId
//         { $set: { reason_of_leave: reason_for_leave } }, // Update the reason_of_leave field
//         { new: true } // Return the updated document
//       );

//       if (updatedAttendance) {
//         updatedRecords.push(updatedAttendance);
//       }
//     }

//     // If no records were updated
//     if (updatedRecords.length === 0) {
//       return res.status(404).json({ message: 'No matching records found to update.' });
//     }

//     return res.status(200).json({
//       message: 'Reason of leave updated successfully for all records.',
//       updatedRecords
//     });
//   } catch (error) {
//     console.error('Error in updateReasonOfLeave:', error);
//     return res.status(500).json({ message: 'Error updating reason of leave.' });
//   }
// };


exports.updateReasonOfLeave = async (req, res) => {
  try {
    const { attendanceDetails } = req.body;  // Array of attendance details with attendanceId and reason_of_leave

    if (!Array.isArray(attendanceDetails) || attendanceDetails.length === 0) {
      return res.status(400).json({ message: 'Please provide valid attendance details.' });
    }

    const updatedRecords = [];

    // Iterate over each attendance detail in the array
    for (let detail of attendanceDetails) {
      const { attendanceId, studentId, reason_for_leave } = detail;

      if (!attendanceId || !studentId || !reason_for_leave) {
        continue; // Skip if attendanceId, studentId or reason_of_leave is missing
      }

      // Find the attendance record by attendanceId
      const attendanceRecord = await Attendance.findOne({ 
        '_id': attendanceId, 
        'attendance.student_id': studentId 
      });

      if (!attendanceRecord) {
        console.log(`No attendance record found for attendanceId: ${attendanceId} and studentId: ${studentId}`);
        continue; // Skip if no matching attendance record is found
      }

      // Find the index of the specific student in the attendance array
      const studentIndex = attendanceRecord.attendance.findIndex(att => att.student_id.toString() === studentId.toString());

      if (studentIndex === -1) {
        console.log(`No student found with studentId: ${studentId}`);
        continue; // Skip if student is not found in the attendance record
      }

      // Update the reason_for_leave for the found student
      attendanceRecord.attendance[studentIndex].reason_for_leave = reason_for_leave;

      // Save the updated record
      const updatedAttendance = await attendanceRecord.save();

      if (updatedAttendance) {
        updatedRecords.push(updatedAttendance);
      }
    }

    // If no records were updated
    if (updatedRecords.length === 0) {
      return res.status(404).json({ message: 'No matching records found to update.' });
    }

    return res.status(200).json({
      message: 'Reason of leave updated successfully for all records.',
      updatedRecords
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating reason of leave.' });
  }
};



  

// exports.getAttendanceByStudentId = async (req, res) => {
//     try {
//         const { studentId } = req.params;

//         // Validate student_id format
//         if (!mongoose.Types.ObjectId.isValid(studentId)) {
//             return res.status(400).json({ message: "Invalid student ID format" });
//         }

//         // Fetch attendance records where the student_id exists in the attendance array
//         const attendanceRecords = await Attendance.find({
//             "attendance.student_id": studentId, // Match documents where the student_id exists in attendance array
//         }).lean(); // Convert to plain JS objects for easier manipulation

//         // Filter attendance array to include only the specific student_id
//         const filteredAttendance = attendanceRecords.map((record) => ({
//             ...record,
//             attendance: record.attendance.filter(
//                 (entry) => entry.student_id.toString() === studentId
//             ),
//         }));

//         return res.status(200).json({
//             message: "Attendance retrieved successfully",
//             attendance: filteredAttendance,
//         });
//     } catch (error) {
//         console.error("Error fetching attendance:", error);
//         return res.status(500).json({
//             message: "Error retrieving attendance",
//             error: error.message,
//         });
//     }
// };

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
            attendance: record.attendance
                .filter((entry) => entry.student_id.toString() === studentId)
                .map((entry) => ({
                    ...entry,
                    behaviour_marks: entry.behaviour_marks || null, // Fetch behaviour_marks
                    resilience: entry.resilience || null, // Fetch resilience
                    knowledge: entry.knowledge || null, // Fetch knowledge
                })),
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

exports.getStudentPercentage= async (req, res) => {
    try {
      const { studentId } = req.params;

      // Fetch all submissions by student
      const submissions = await Submission.find({ student_id: studentId, status: "GRADED" });
        // console.log(submissions)
      if (!submissions.length) {
        return res.status(404).json({ success: false, msg: "No graded submissions found for this student." });
      }

      // Collect data for resource and course relationships
      const resourceIds = submissions.map((submission) => submission.resource);
      const resources = await Resource.find({ _id: { $in: resourceIds } });
        
      // Create a map of resource IDs to their respective courses
      const courseMap = {};
      resources.forEach((resource) => {
        if (!courseMap[resource.course]) {
          courseMap[resource.course] = [];
        }
        courseMap[resource.course].push(resource);
      });

      // Fetch course details
      const courseIds = Object.keys(courseMap);
      const courses = await Course.find({ _id: { $in: courseIds } });

      // Calculate percentage for each course
      const coursePercentages = courses.map((course) => {
        const courseResources = courseMap[course._id.toString()];
        const totalObtainedMarks = submissions
          .filter((submission) =>
            courseResources.some((resource) => resource._id.toString() === submission.resource.toString())
          )
          .reduce((sum, submission) => sum + submission.obtained_marks, 0);

        const totalMarks = courseResources.reduce((sum, resource) => sum + resource.totalMarks, 0);

        return {
          course_name: course.course_name,
          percentage: totalMarks > 0 ? (totalObtainedMarks / totalMarks) * 100 : 0,
        };
      });

      res.status(200).json({ success: true, data: coursePercentages });
    } catch (error) {
      console.error("Error fetching student percentage:", error.message);
      res.status(500).json({ success: false, msg: "Server error" });
    }
  }





// exports.getStudentPercentage = async (req, res) => {
//     try {
//       const { studentId } = req.params;
  
//       // Fetch all submissions by student
//       const submissions = await Submission.find({ student_id: studentId, status: "GRADED" });
  
//       // Collect data for resource and course relationships
//       const resourceIds = submissions.map((submission) => submission.resource);
//       const resources = await Resource.find({ _id: { $in: resourceIds } });
  
//       // Create a map of resource IDs to their respective courses
//       const courseMap = {};
//       resources.forEach((resource) => {
//         if (!courseMap[resource.course]) {
//           courseMap[resource.course] = [];
//         }
//         courseMap[resource.course].push(resource);
//       });
  
//       // Fetch all courses
//       const allCourses = await Course.find(); // Fetch all courses, not just the ones with resources
  
//       // Calculate percentage for each course
//       const coursePercentages = allCourses.map((course) => {
//         const courseResources = courseMap[course._id.toString()] || [];
//         const totalObtainedMarks = submissions
//           .filter((submission) =>
//             courseResources.some((resource) => resource._id.toString() === submission.resource.toString())
//           )
//           .reduce((sum, submission) => sum + submission.obtained_marks, 0);
  
//         const totalMarks = courseResources.reduce((sum, resource) => sum + resource.totalMarks, 0);
  
//         return {
//           course_name: course.course_name,
//           percentage: totalMarks > 0 ? (totalObtainedMarks / totalMarks) * 100 : 0,
//         };
//       });
  
//       res.status(200).json({ success: true, data: coursePercentages });
//     } catch (error) {
//       console.error("Error fetching student percentage:", error.message);
//       res.status(500).json({ success: false, msg: "Server error" });
//     }
//   };
  
