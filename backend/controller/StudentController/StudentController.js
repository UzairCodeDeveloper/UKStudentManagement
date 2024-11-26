// Importing MODEL(s)
const User = require("../../models/User");
const Role = require("../../models/Role");
const Enrollment = require("../../models/Enrolment");

const getAllStudents = async (req, res) => {
  try {
      const roleParam = req.params.role;
  
      // Validate that role is either 'student' or 'guardian'
      if (roleParam !== "student" && roleParam !== "guardian") {
          return res.status(400).json({ errors: [{ msg: "Invalid Role!" }] });
      }
  
      // Find the Role object based on the role name
      let roleObj = await Role.findOne({ name: roleParam });
      if (!roleObj) {
          return res.status(400).json({ errors: [{ msg: "This role does not exist in the database!" }] });
      }
  
      // Find users with the specified role and where isActive is true
      const users = await User.find({ role: roleObj._id, isActive: true }).select("-password");
  
      // Check if no users are found
      if (users.length === 0) {
          return res.status(404).json({ errors: [{ msg: "No active users found" }] });
      }
  
      // Return the active users found
      return res.status(200).json(users);
  } catch (err) {
      console.error(err.message);
      return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the ID is in the correct format (valid MongoDB ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ errors: [{ msg: "Invalid Student ID format" }] });
    }

    // Find the student by ID and ensure they have the 'student' role
    const student = await User.findOne({ _id: id});

    if (!student) {
      return res.status(404).json({ errors: [{ msg: "Student not found" }] });
    }

    // Soft delete: mark student as inactive (instead of deleting from the database)
    student.isActive = false;  // Use `isActive` as per your schema

    // Save the updated student status
    await student.save();

    return res.status(200).json({ msg: "Student marked as inactive successfully", student });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};


// get student by id
const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate that the ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ errors: [{ msg: "Invalid Student ID format" }] });
    }

    // Get the role object for 'student'
    const studentRole = await Role.findOne({ name: "student" });
    if (!studentRole) {
      return res.status(400).json({ errors: [{ msg: "Student role does not exist" }] });
    }

    // Find the student by ID and role
    const student = await User.findOne({ _id: id, role: studentRole._id }).select("-password");

    if (!student) {
      return res.status(404).json({ errors: [{ msg: "Student not found" }] });
    }

    // Find the student's enrollment and populate the class
    const enrollment = await Enrollment.findOne({ student_id: id }).populate('class_id'); // Populate class details

    if (!enrollment) {
      return res.status(404).json({ errors: [{ msg: "Enrollment not found for the student" }] });
    }

    // Combine student and class data
    const studentData = {
      ...student._doc,
      enrollment: {
        fee_payment_method: enrollment.fee_payment_method,
        due_date: enrollment.due_date,
        status: enrollment.status,
        enrollment_date: enrollment.enrollment_date,
        class: enrollment.class_id, // This contains the populated class details
      }
    };

    return res.status(200).json(studentData);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};

// const updateStudent = async (req, res) => {
//   const { id } = req.params;
//   console.log(res)
//   console.log(req.body);

//   // Check if student_details is present
//   if (!req.body.student_details) {
//     return res.status(400).json({ errors: [{ msg: "student_details is required" }] });
//   }

//   const { 
//     familyRegNo,
//     forename, 
//     surname, 
//     gender, 
//     dob, 
//     doctorDetails, 
//     guardianDetails, 
//     interests,
//     msuExamCertificate // Extract msuExamCertificate from the request
//   } = req.body.student_details;

//   try {
//     // Validate that the ID is a valid MongoDB ObjectId
//     if (!id.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ errors: [{ msg: "Invalid Student ID format" }] });
//     }

//     // Get the role object for 'student'
//     const studentRole = await Role.findOne({ name: "student" });
//     if (!studentRole) {
//       return res.status(400).json({ errors: [{ msg: "Student role does not exist" }] });
//     }

//     // Find the student by ID and role
//     let student = await User.findOne({ _id: id, role: studentRole._id });
//     if (!student) {
//       return res.status(404).json({ errors: [{ msg: "Student not found" }] });
//     }

//     // Update the student's studentData fields
//     student.studentData.familyRegNo = familyRegNo || student.studentData.familyRegNo;
//     student.studentData.forename = forename || student.studentData.forename;
//     student.studentData.surname = surname || student.studentData.surname;
//     student.studentData.gender = gender || student.studentData.gender;
//     student.studentData.dob = dob || student.studentData.dob;
//     student.studentData.doctorDetails = doctorDetails || student.studentData.doctorDetails;
//     student.studentData.guardianDetails = guardianDetails || student.studentData.guardianDetails;
//     student.studentData.interests = interests || student.studentData.interests;

//     // Update msuExamCertificate
//     student.studentData.msuExamCertificate = msuExamCertificate || student.studentData.msuExamCertificate;

//     // Save the updated student
//     await student.save();

//     return res.status(200).json({ msg: "Student updated successfully", student });
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).json({ errors: [{ msg: "Server Error" }] });
//   }
// };

const updateStudent = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);

  // Check if student_details is present
  if (!req.body.student_details) {
    return res.status(400).json({ errors: [{ msg: "student_details is required" }] });
  }

  const { 
    familyRegNo,
    forename, 
    surname, 
    gender, 
    dob, 
    doctorDetails, 
    guardianDetails, 
    interests,
    msuExamCertificate // Extract msuExamCertificate from the request
  } = req.body.student_details;

  try {
    // Validate that the ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ errors: [{ msg: "Invalid Student ID format" }] });
    }

    // Get the role object for 'student'
    const studentRole = await Role.findOne({ name: "student" });
    if (!studentRole) {
      return res.status(400).json({ errors: [{ msg: "Student role does not exist" }] });
    }

    // Find the student by ID and role
    let student = await User.findOne({ _id: id, role: studentRole._id });
    if (!student) {
      return res.status(404).json({ errors: [{ msg: "Student not found" }] });
    }

    // Log the student data for debugging
    console.log("Student found:", student);

    // Update the student's studentData fields using $set
    const updateFields = {};

    if (familyRegNo) updateFields["studentData.familyRegNo"] = familyRegNo;
    if (forename) updateFields["studentData.forename"] = forename;
    if (surname) updateFields["studentData.surname"] = surname;
    if (gender) updateFields["studentData.gender"] = gender;
    if (dob) updateFields["studentData.dob"] = dob;
    if (doctorDetails) updateFields["studentData.doctorDetails"] = doctorDetails;
    if (guardianDetails) updateFields["studentData.guardianDetails"] = guardianDetails;
    if (interests) updateFields["studentData.interests"] = interests;
    if (msuExamCertificate) updateFields["studentData.msuExamCertificate"] = msuExamCertificate;

    // Perform the update operation using updateOne
    const updatedStudent = await User.updateOne(
      { _id: id, role: studentRole._id },
      { $set: updateFields }
    );

    // Check if the student was updated
    if (updatedStudent.modifiedCount === 0) {
      return res.status(400).json({ errors: [{ msg: "No changes made to the student record" }] });
    }

    return res.status(200).json({ msg: "Student updated successfully" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ errors: [{ msg: "Server Error" }] });
  }
};



module.exports = { getAllStudents,deleteStudent,getStudentById,updateStudent };
