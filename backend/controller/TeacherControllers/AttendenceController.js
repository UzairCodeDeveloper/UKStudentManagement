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
        
        // Convert to UTC and format it as YYYY-MM-DD
        const utcToday = new Date(today.getTime() + today.getTimezoneOffset() * 60000);
        
        // Extract the date part in YYYY-MM-DD format
        const dateString = utcToday.toISOString().split('T')[0];

        // Iterate through unique classes and check if attendance is marked for today
        for (const classObj of uniqueClasses) {
            const attendanceRecord = await Attendance.findOne({
                class_id: classObj._id,
                date: dateString  // Compare only the date, ignoring time
            });
            // console.log(classObj._id,today,attendanceRecord);

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


// Controller to get attendance records for a specific user by user_id
// Controller to get attendance records for a specific user by user_id and month-year
exports.getUserAttendance = async (req, res) => {
    const user_id = req.user.id; // Extract the user ID from the authenticated user
    const { month, year } = req.params; // Extract month and year from params

    try {
        if (!month || !year) {
            return res.status(400).json({ msg: 'Month and Year are required as parameters.' });
        }

        // Construct the start and end date range for the specified month-year
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1); // Move to the next month
        endDate.setDate(0); // Set to the last day of the month

        // Fetch attendance records for the user within the specified month-year range
        const attendanceRecords = await Attendance.find({
            'attendance.student_id': user_id,
            date: { $gte: startDate, $lte: endDate },
        }).lean();

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).json({ msg: 'No attendance records found for this user in the specified month-year.' });
        }

        // Format the attendance records to include only date and status for the user
        const formattedAttendance = attendanceRecords.map(record => {
            const userAttendance = record.attendance.find(entry => entry.student_id.toString() === user_id);
            return {
                date: record.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                status: userAttendance.status,                // Attendance status (present, absent, leave)
            };
        });

        // Return the formatted attendance data
        return res.status(200).json({ msg: 'Attendance records found', data: formattedAttendance });

    } catch (error) {
        console.error('Error fetching user attendance:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};