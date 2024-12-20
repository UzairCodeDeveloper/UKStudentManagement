const Attendance = require('../../models/Attendance');
const Course = require('../../models/Course');
const Enrolment = require('../../models/Enrolment');

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
                const { student_id, status,resilience,knowledge,behaviour_marks } = record;
                const { forename, surname, guardianDetails, roll_number } = student_id.studentData;

                return {
                    roll_no: student_id.user_id,  // User's actual user_id
                    class_id: class_id,           // Using class_id from params
                    roll_number: student_id.roll_number || roll_number,  // Student's roll number
                    forename,                     // Student's first name
                    surname,                      // Student's last name
                    fatherName: guardianDetails.guardianName,  // Father's/guardian's name
                    status,                       // Attendance status (present, absent, leave)
                    student_id: student_id._id,   // Student's unique ID
                    resilience,
                    knowledge,
                    behaviour_marks
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


exports.FetchReasonForLeave = async (req, res) => {
    const { class_id, date } = req.params;  // Extract class_id and date from params
    try {
        // Check if attendance for the class and date already exists
        const attendance = await Attendance.findOne({ class_id, date: new Date(date) })
            .lean()
            .populate('attendance.student_id', 'studentData roll_number user_id _id');

        if (attendance) {
            // Filter attendance where status is "absent" or "late"
            const filteredAttendance = attendance.attendance.filter(record => 
                ['absent', 'late'].includes(record.status)
            );

            // If there are records for absent or late students, return the attendance data
            if (filteredAttendance.length > 0) {
                const formattedAttendance = filteredAttendance.map(record => {
                    const { student_id, status, reason_for_leave } = record;
                    const { forename, surname, guardianDetails, roll_number } = student_id.studentData;

                    return {
                        roll_no: student_id.user_id,  // User's actual user_id
                        class_id: class_id,            // Using class_id from params
                        roll_number: student_id.roll_number || roll_number,  // Student's roll number
                        forename,                      // Student's first name
                        surname,                       // Student's last name
                        fatherName: guardianDetails.guardianName,  // Father's/guardian's name
                        status,                        // Attendance status (absent/late)
                        reason_for_leave               // Reason for leave (if any)
                    };
                });

                return res.status(200).json({ msg: 'Attendance record found', marked: true, data: formattedAttendance });
            } else {
                return res.status(200).json({ msg: 'No students absent or late', marked: false, data: [] });
            }
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
        return res.status(200).json({ msg: 'Attendance not marked', marked: false, data: formattedResponse });

    } catch (error) {
        console.error('Error fetching attendance or enrolled students:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};
