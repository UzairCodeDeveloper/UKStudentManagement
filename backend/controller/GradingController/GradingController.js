
const Enrolment = require('../../models/Enrolment');
const Grading = require('../../models/grading');
const Class = require('../../models/Class'); // Assuming a Class model exists


exports.FetchStudentRecords = async (req, res) => {
    const { class_id, exam } = req.body; // Extract class_id and exam from request body (match the request keys)
    // console.log(req.body);

    try {
        // Fetch the list of enrolled students based on class_id
        const students = await Enrolment.find({ class_id })
            .populate('student_id', 'studentData roll_number user_id _id')
            .lean();

        if (!students.length) {
            return res.status(404).json({ msg: 'No students found for the given class', data: [] });
        }

        // Fetch the grading records for the given class_id and exam
        const gradingRecords = await Grading.find({ class_id, exam_name: exam })
            .lean();

        // Format the response for each enrolled student
        const formattedResponse = students.map(enrollment => {
            const { student_id } = enrollment;
            const { forename, surname, guardianDetails, roll_number } = student_id.studentData;

            // Find the grading record for the student (if it exists)
            const gradingRecord = gradingRecords.find(record => 
                record.student_id.toString() === student_id._id.toString()
            );
            
            // If no grading record found, default to 0, else use the obtained marks
            const obtained_marks = gradingRecord ? gradingRecord.obtained_marks : 0;

            return {
                roll_no: student_id.user_id,  // User's actual user_id
                class_id: class_id,           // Using class_id from params
                forename,                     // Student's first 
                student_id: student_id._id,   // Student's unique ID
                obtained_marks               // Add obtained marks (0 if no record found)
            };
        });

        // Return the formatted list of enrolled students with obtained marks
        return res.status(200).json({ msg: 'Student records fetched successfully', data: formattedResponse });

    } catch (error) {
        console.error('Error fetching student records:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};



exports.FetchRecords = async (req, res) => {
    const { class_id, exam_name } = req.body;  // Extract class_id and exam_name from the request body
    // console.log(req.body);

    try {
        // Fetch the grading records for the given class_id and exam_name
        const gradingRecords = await Grading.find({ class_id, exam_name })
            .lean();

        // If no grading records are found, return the appropriate message
        if (!gradingRecords.length) {
            return res.status(404).json({ msg: 'No grading records found for the given class and exam', data: [] });
        }

        // Extract the student IDs from the grading records
        const studentIdsWithGrading = gradingRecords.map(record => record.student_id);

        // Fetch the list of enrolled students based on class_id (only those students who have grading records)
        const students = await Enrolment.find({ 
            class_id, 
            student_id: { $in: studentIdsWithGrading } // Only include students who have grading records
        })
            .populate('student_id', 'studentData roll_number user_id _id')
            .lean();

        if (!students.length) {
            // return res.status(404).json({ msg: 'No students found with grading records for the given class and exam', data: [] });
        }

        // Format the response for each enrolled student
        const formattedResponse = students.map(enrollment => {
            const { student_id } = enrollment;
            const { roll_number } = student_id.studentData;

            // Find the grading record for the student (since we know the student has a grading record)
            const gradingRecord = gradingRecords.find(record => 
                record.student_id.toString() === student_id._id.toString()
            );

            const obtained_marks = gradingRecord ? gradingRecord.obtained_marks : 0;
            // Return the student record with grading ID only if grading record exists
            return {
                roll_no: student_id.user_id,  // Roll number of the student
                class_id: class_id,           // Class ID
                forename: student_id.studentData.forename,  // Student's forename
                student_id: student_id._id,   // Student's unique ID
                id: gradingRecord ? gradingRecord._id : null, // Grading record ID (only if grading record exists)
                obtained_marks
            };
        });

        // Return the formatted list of student records
        return res.status(200).json({ msg: 'Student records fetched successfully', data: formattedResponse });

    } catch (error) {
        console.error('Error fetching student records:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};



exports.DeleteGradingRecord = async (req, res) => {
    const { id } = req.params;  // Extract the id from the URL parameters
    // console.log(req.params);

    if (!id) {
        return res.status(400).json({ msg: 'No ID provided' });
    }

    try {
        // Find and delete the grading record by the provided id
        const gradingRecord = await Grading.findByIdAndDelete(id);

        // If the grading record doesn't exist, return a 404 response
        if (!gradingRecord) {
            return res.status(404).json({ msg: 'Grading record not found' });
        }

        // Successfully deleted the record
        return res.status(200).json({ msg: 'Grading record deleted successfully' });

    } catch (error) {
        console.error('Error deleting grading record:', error.message);
        res.status(500).json({ msg: 'Server Error' });
    }
};




exports.creatinggrade = async (req, res) => {
    const { classSelected, examSelected, submissions } = req.body;
    
    if (!classSelected || !examSelected || !submissions || submissions.length === 0) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      // Check if class exists
      const classExists = await Class.findById(classSelected);
      if (!classExists) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Iterate over each submission to either update or create new records
      const gradingPromises = submissions.map(async (submission) => {
        const { student_id, obtained_marks } = submission;
  
        // Validate obtained marks
        if (obtained_marks < 0 || obtained_marks > 100) {
          return res.status(400).json({ message: 'Grade must be between 0 and 100' });
        }
  
        // Check if the student is enrolled in the class
        const enrollment = await Enrolment.findOne({ student_id, class_id: classSelected });
        if (!enrollment || !enrollment.isActive) {
          return res.status(404).json({ message: 'Student is not enrolled in this class or enrollment is inactive' });
        }
  
        // Check if a grading record for the student already exists
        const existingGrade = await Grading.findOne({
          class_id: classSelected,
          exam_name: examSelected,
          student_id,
        });
  
        if (existingGrade) {
          // If record exists, update it
          existingGrade.obtained_marks = obtained_marks;
          await existingGrade.save();
        } else {
          // If record doesn't exist, create a new one
          const newGrade = new Grading({
            class_id: classSelected,
            exam_name: examSelected,
            student_id,
            obtained_marks,
          });
  
          await newGrade.save();
        }
      });
  
      // Wait for all grading records to be saved/updated
      await Promise.all(gradingPromises);
  
      // Send success response
      return res.status(201).json({ message: 'Grades added or updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  