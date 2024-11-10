const Attendance = require('../../models/Attendance');
const Course = require('../../models/Course');
const Enrolment = require('../../models/Enrolment');



// Returns classes for an instructor
exports.getAttendanceRecordsForInstructor = async (req, res) => {
    const { id } = req.user;  // The instructor/user ID

    try {
        // Find all courses taught by the instructor and populate class details
        const courses = await Course.find({ instructor: id }).populate('class_id').lean();

        if (courses.length === 0) {
            return res.status(404).json({ msg: 'No courses found for this instructor' });
        }

        // Use a map to track unique class IDs and filter out duplicates
        const uniqueClassesMap = new Map();

        for (const course of courses) {
            const classId = course.class_id._id.toString();
            if (!uniqueClassesMap.has(classId)) {
                uniqueClassesMap.set(classId, course.class_id);  // Store the class data
            }
        }

        // Convert the Map values (unique class objects) to an array
        const uniqueClasses = Array.from(uniqueClassesMap.values());

        // Get today's date at midnight (00:00:00)
        const today = new Date();
        today.setHours(0, 0, 0, 0);  // Set time to midnight

        // Iterate through unique classes and check if attendance is marked for today
        for (const classObj of uniqueClasses) {
            const attendanceRecord = await Attendance.findOne({
                class_id: classObj._id,
                date: today  // Compare only the date, ignoring time
            });

            // Add a new field to indicate if attendance is marked today
            classObj.isAttendanceMarkedToday = attendanceRecord ? true : false;
        }

        // Return the array of unique classes with the attendance status for today
        res.status(200).json(uniqueClasses);

    } catch (error) {
        console.error('Error fetching attendance records:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Fetch Attendence records of the users in a class on specified date Get enrolled students in a class by class_id (date currently not used)
exports.FetchAttendanceRecord = async (req, res) => {
    const { class_id, date } = req.params;  // Extract class_id and date from params
    try {
        // Check if attendance for the class and date already exists
        const attendance = await Attendance.findOne({ class_id, date: new Date(date) })
            .lean()
            .populate('attendance.student_id', 'studentData roll_number user_id _id');

        if (attendance) {
            // If attendance exists, return the attendance data
            const formattedAttendance = attendance.attendance.map(record => {
                const { student_id, status } = record;
                const { forename, surname, guardianDetails, roll_number } = student_id.studentData;

                return {
                    roll_no: student_id.user_id,  // User's actual user_id
                    class_id: class_id,           // Using class_id from params
                    roll_number: student_id.roll_number || roll_number,  // Student's roll number
                    forename,                     // Student's first name
                    surname,                      // Student's last name
                    fatherName: guardianDetails.guardianName,  // Father's/guardian's name
                    status,                       // Attendance status (present, absent, leave)
                    student_id: student_id._id    // Student's unique ID
                };
            });

            return res.status(200).json({ msg: 'Attendance record found',marked:true, data: formattedAttendance });
        }

        // If attendance does not exist, fetch the list of enrolled students
        const students = await Enrolment.find({ class_id })
            .populate('student_id', 'studentData roll_number user_id _id')
            .lean();

        // Format the response for each enrolled student
        const formattedResponse = students.map(enrollment => {
            const { student_id } = enrollment;
            const { forename, surname, guardianDetails, roll_number } = student_id.studentData;

            return {
                roll_no: student_id.user_id,  // User's actual user_id
                class_id: class_id,           // Using class_id from params
                roll_number: student_id.roll_number || roll_number,  // Student's roll number
                forename,                     // Student's first name
                surname,                      // Student's last name
                fatherName: guardianDetails.guardianName,  // Father's/guardian's name
                student_id: student_id._id    // Student's unique ID
            };
        });

        // Return the formatted list of enrolled students if no attendance record is found
        return res.status(200).json({ msg: 'Attendance not Marked',marked:false, data: formattedResponse });

    } catch (error) {
        console.error('Error fetching attendance or enrolled students:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};

// Controller to mark attendance
exports.markAttendance = async (req, res) => {
    const { class_id, date, attendance } = req.body;

    try {
        // Validate that attendance is provided and contains valid status values
        if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
            return res.status(400).json({ msg: 'Attendance data is required and should be a non-empty array.' });
        }

        const validStatuses = ['present', 'absent', 'leave'];
        const invalidStatus = attendance.some(item => !validStatuses.includes(item.status));
        if (invalidStatus) {
            return res.status(400).json({ msg: `Each student's status must be one of: ${validStatuses.join(', ')}.` });
        }

        // Check if attendance has already been marked for the class and date
        let existingAttendance = await Attendance.findOne({ class_id, date: new Date(date) });

        if (existingAttendance) {
            // If attendance exists, update it
            existingAttendance.attendance = attendance; // Update attendance array with new data
            await existingAttendance.save();

            return res.status(200).json({ msg: 'Attendance updated successfully', data: existingAttendance });
        } else {
            // If attendance doesn't exist, create a new record
            const newAttendance = new Attendance({
                class_id,
                date: new Date(date),  // Ensure the date is stored as a Date object
                marked: 'true',        // Mark it as true (attendance taken)
                attendance
            });

            // Save the new attendance record
            await newAttendance.save();

            return res.status(201).json({ msg: 'Attendance marked successfully', data: newAttendance });
        }
        
    } catch (error) {
        console.error('Error marking attendance:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};





// ___________________________________________________________________________




// // 1. Create attendance record
// exports.createAttendance = async (req, res) => {
//     const { student_id, course_id, date, status } = req.body;  // Get data from request body

//     try {
//         const classObj = await Course.findById(course_id).select('class_id').lean();
//         console.log(classObj.class_id);
//         // Check if the student is enrolled in the course
//         const enrollment = await Enrolment.findOne({
//             'student_id': student_id,
//             'class_id': classObj.class_id, // Ensure you're using 'class_id' or whatever represents course_id
//         });

//         if (!enrollment) {
//             return res.status(404).json({ msg: 'Student not enrolled in this course' });
//         }

//         // Create a new attendance record
//         const attendance = new Attendance({
//             student_id,
//             course_id,
//             date,
//             status,
//         });

//         await attendance.save();
//         res.status(201).json({ msg: 'Attendance record created successfully', attendance });
//     } catch (error) {
//         console.error('Error creating attendance record:', error.message);
//         res.status(500).json({ msg: 'Server Error' });
//     }
// };

// // 2. Get attendance record for a student
// exports.getStudentAttendance = async (req, res) => {
//     const { course_id, student_id, date } = req.query;  // Use query params for course, student, and date

//     try {
//         const attendance = await Attendance.findOne({ 
//             student_id, 
//             course_id, 
//             date: new Date(date) 
//         }).lean();

//         if (!attendance) {
//             return res.status(404).json({ msg: 'Attendance not marked for this date' });
//         }

//         res.status(200).json(attendance);
//     } catch (error) {
//         console.error('Error fetching attendance:', error.message);
//         res.status(500).json({ msg: 'Server Error' });
//     }
// };

// // 3. Update attendance record
// exports.updateAttendance = async (req, res) => {
//     const { attendance_id } = req.params;  // Attendance record ID to update
//     const { status } = req.body;  // New status

//     try {
//         // Find the attendance record by ID and update
//         const attendance = await Attendance.findByIdAndUpdate(
//             attendance_id,
//             { status },
//             { new: true }  // Return the updated record
//         );

//         if (!attendance) {
//             return res.status(404).json({ msg: 'Attendance record not found' });
//         }

//         res.status(200).json({ msg: 'Attendance record updated', attendance });
//     } catch (error) {
//         console.error('Error updating attendance:', error.message);
//         res.status(500).json({ msg: 'Server Error' });
//     }
// };

// // 4. Delete attendance record
// exports.deleteAttendance = async (req, res) => {
//     const { attendance_id } = req.params;  // Attendance record ID to delete

//     try {
//         const attendance = await Attendance.findByIdAndDelete(attendance_id);

//         if (!attendance) {
//             return res.status(404).json({ msg: 'Attendance record not found' });
//         }

//         res.status(200).json({ msg: 'Attendance record deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting attendance record:', error.message);
//         res.status(500).json({ msg: 'Server Error' });
//     }
// };

// // 5. Get all attendance records for a course on a specific date
// exports.getAllAttendanceForCourse = async (req, res) => {
//     const { course_id, date } = req.query;  // Use query params for course and date

//     try {
//         const attendances = await Attendance.find({
//             course_id,
//             date: new Date(date)
//         }).populate('student_id', 'studentData roll_number user_id _id').lean();

//         if (attendances.length === 0) {
//             return res.status(404).json({ msg: 'No attendance records for this course on the given date' });
//         }

//         res.status(200).json(attendances);
//     } catch (error) {
//         console.error('Error fetching attendance records:', error.message);
//         res.status(500).json({ msg: 'Server Error' });
//     }
// };
