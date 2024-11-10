const { id } = req.params;  // course ID
        const userId = req.user.id;  // instructor/user ID

        try {
            const course = await Course.findById({ _id: id, instructor: userId }).select('class_id').lean();

            if (!course) {
                return res.status(404).json({ msg: 'Course not found or you are not the instructor' });
            }

            const students = await Enrolment.find({ class_id: course.class_id })
                .populate('student_id', 'studentData roll_number user_id _id')
                .lean();

            const formattedResponse = students.map(enrollment => {
                const { student_id, status, fee_payment_method, enrollment_date } = enrollment;
                const { forename, surname, guardianDetails, roll_number, user_id } = student_id.studentData;

                return {
                    user_id: student_id.user_id, 
                    course_id: id, 
                    roll_number: student_id.roll_number || roll_number, 
                    forename,
                    surname,
                    fatherName: guardianDetails.guardianName,
                    status,
                    fee_payment_method,
                    enrollment_date,
                    user_id: student_id._id  
                };
            });

            res.status(200).json(formattedResponse);

        } catch (error) {
            console.error('Error fetching students enrolled in the course:', error.message);
            res.status(500).json({ msg: 'Server Error' });
        }