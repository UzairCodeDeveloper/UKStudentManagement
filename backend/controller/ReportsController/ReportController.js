const express = require('express');
const Class = require('../../models/Class');
const Course = require('../../models/Course');
const Resource = require('../../models/Resource');
const Submission = require('../../models/Submission');
const Enrolment = require('../../models/Enrolment');
const Volunteer = require('../../models/Volunteer');
const User = require('../../models/User');
const Attendance =require("../../models/Attendance")
const ClassbasedPerformance = async (req, res) => {
    try {
        const { classId } = req.params;

        // Fetch class details
        const classDetails = await Class.findById(classId);
        if (!classDetails) {
            return res.status(404).json({ message: 'Class not found' });
        }

        // Fetch enrolled students in the class
        const enrollments = await Enrolment.find({ class_id: classId });
        const totalStudents = enrollments.length;

        if (totalStudents === 0) {
            return res.status(404).json({ message: 'No students enrolled in this class.' });
        }

        // Fetch all courses for the class
        const courses = await Course.find({ class_id: classId });

        let totalResources = { BOOK: 0, ASSIGNMENT: 0, SYLLABUS: 0, HOMEWORK: 0, OTHERS: 0 };
        let totalSubmissions = { total: 0, graded: 0, pending: 0, rejected: 0 };
        let totalMarks = { awarded: 0, possible: 0 };

        const courseDetails = [];
        let overallClassPerformance = 0;

        // Iterate over courses and process the data
        await Promise.all(
            courses.map(async (course) => {
                const instructor = await Volunteer.findById(course.instructor);
                const instructorName = instructor ? instructor.volunteer_details.full_name : 'Unknown Instructor';

                const resources = await Resource.find({ course: course._id });

                const resourceStats = { total: 0, types: {}, submissionCounts: { graded: 0, pending: 0, rejected: 0 }, resourceSubmissions: {} };
                const submissionStats = { total: 0, graded: 0, pending: 0, rejected: 0 };
                const studentSubmissions = new Set();
                let marksAwarded = 0;
                let marksPossible = 0;
                let totalSubmissionCount = 0;

                await Promise.all(
                    resources.map(async (resource) => {
                        resourceStats.total++;
                        resourceStats.types[resource.resource_type] =
                            (resourceStats.types[resource.resource_type] || 0) + 1;

                        totalResources[resource.resource_type]++;

                        const submissions = await Submission.find({ resource: resource._id });

                        // Track submission status priority for the resource
                        let hasGraded = false;
                        let hasPending = false;
                        let hasRejected = false;

                        // Track unique student submissions
                        const uniqueStudentSubmissions = new Set();

                        submissions.forEach((submission) => {
                            const studentId = submission.student_id.toString();
                            if (!uniqueStudentSubmissions.has(studentId)) {
                                uniqueStudentSubmissions.add(studentId);

                                if (submission.status === 'GRADED') {
                                    hasGraded = true;
                                    marksAwarded += submission.marks_obtained || 0;
                                    marksPossible += 5; // Assume each graded resource has 5 possible marks
                                } else if (submission.status === 'PENDING') {
                                    hasPending = true;
                                } else if (submission.status === 'REJECTED') {
                                    hasRejected = true;
                                }

                                studentSubmissions.add(studentId);
                            }
                        });

                        // Increment submission counts based on priority
                        if (hasGraded) {
                            resourceStats.submissionCounts.graded++;
                            totalSubmissions.graded++;
                        } else if (hasPending) {
                            resourceStats.submissionCounts.pending++;
                            totalSubmissions.pending++;
                        } else if (hasRejected) {
                            resourceStats.submissionCounts.rejected++;
                            totalSubmissions.rejected++;
                        }

                        totalSubmissions.total += uniqueStudentSubmissions.size;
                        totalSubmissionCount += uniqueStudentSubmissions.size;  // Keep track of total submissions
                        
                        // Record the resource-specific submission count
                        resourceStats.resourceSubmissions[resource._id] = uniqueStudentSubmissions.size;
                    })
                );

                // Calculate the submission ratio
                const totalPossibleSubmissions = totalStudents * resourceStats.total;
                const submissionRatio = (totalSubmissionCount / totalPossibleSubmissions) * 100 || 0;

                const courseCompletionRate = (studentSubmissions.size / totalStudents) * 100 || 0;
                const coursePerformanceScore = courseCompletionRate;

                totalMarks.awarded += marksAwarded;
                totalMarks.possible += marksPossible;

                overallClassPerformance += coursePerformanceScore;

                courseDetails.push({
                    course_name: course.course_name,
                    instructor: instructorName,
                    total_students: totalStudents,
                    resources: resourceStats,
                    submission_statistics: {
                        total: submissionStats.total,
                        graded: submissionStats.graded,
                        pending: submissionStats.pending,
                        rejected: submissionStats.rejected,
                    },
                    submission_ratio: submissionRatio.toFixed(2),  // Add the submission ratio here
                    marks: {
                        awarded: marksAwarded,
                        possible: marksPossible,
                        average_per_submission:
                            submissionStats.graded > 0 ? (marksAwarded / submissionStats.graded).toFixed(2) : 0,
                    },
                    completion_rate: `${courseCompletionRate.toFixed(2)}%`,
                    course_performance_score: coursePerformanceScore.toFixed(2),
                });
            })
        );

        overallClassPerformance = courses.length > 0 ? overallClassPerformance / courses.length : 0;

        res.json({
            class_name: classDetails.class_name,
            total_courses: courses.length,
            total_students: totalStudents,
            total_resources: totalResources,
            submission_statistics: totalSubmissions,
            total_marks: {
                awarded: totalMarks.awarded,
                possible: totalMarks.possible,
            },
            course_details: courseDetails,
            overall_class_performance: `${overallClassPerformance.toFixed(2)}%`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};




// 

const generateStudentReport = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Step 1: Get the class ID for the given student
        const enrolment = await Enrolment.findOne({ student_id: studentId, isActive: true }).exec();
        if (!enrolment) {
            return res.status(404).json({ message: 'Student enrolment not found.' });
        }
        const classId = enrolment.class_id;

        // Step 2: Fetch all courses related to the class ID
        const courses = await Course.find({ class_id: classId, is_active: true }).exec();
        if (courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this class.' });
        }

        const courseIds = courses.map((course) => course._id);

        // Step 3: Fetch all resources for the courses
        const resources = await Resource.find({ course: { $in: courseIds }, isActive: true }).exec();

        // Step 4: Fetch submissions for the student related to these resources
        const submissions = await Submission.find({
            resource: { $in: resources.map((resource) => resource._id) },
            student_id: studentId,
        }).exec();

        // Step 5: Fetch attendance record for the student
        const attendanceRecords = await Attendance.find({
            class_id: classId,
            'attendance.student_id': studentId,
        }).exec();

        const attendanceStats = {
            totalPresent: 0,
            totalAbsent: 0,
            totalLate: 0,
            averageResilience: 0,
            averageKnowledge: 0,
            averageBehaviour: 0,
        };

        // Calculate the total number of presents, absents, lates, and averages
        attendanceRecords.forEach((attendanceRecord) => {
            attendanceRecord.attendance.forEach((entry) => {
                if (entry.student_id.toString() === studentId) {
                    // Count present, absent, and late statuses
                    if (entry.status === 'present') attendanceStats.totalPresent++;
                    if (entry.status === 'absent') attendanceStats.totalAbsent++;
                    if (entry.status === 'late') attendanceStats.totalLate++;

                    // Sum the resilience, knowledge, and behaviour marks for averages
                    attendanceStats.averageResilience += entry.resilience;
                    attendanceStats.averageKnowledge += entry.knowledge;
                    attendanceStats.averageBehaviour += entry.behaviour_marks;
                }
            });
        });

        // Calculate averages for resilience, knowledge, and behaviour
        const attendanceCount = attendanceStats.totalPresent + attendanceStats.totalAbsent + attendanceStats.totalLate;
        if (attendanceCount > 0) {
            attendanceStats.averageResilience = (attendanceStats.averageResilience / attendanceCount).toFixed(2);
            attendanceStats.averageKnowledge = (attendanceStats.averageKnowledge / attendanceCount).toFixed(2);
            attendanceStats.averageBehaviour = (attendanceStats.averageBehaviour / attendanceCount).toFixed(2);
        }

        // Step 6: Generate the report for courses and resources
        const report = courses.map((course) => {
            const courseResources = resources.filter((resource) => resource.course.toString() === course._id.toString());

            const resourceStats = {
                course_name: course.course_name,
                total_resources: courseResources.length,
                total_graded_resources: 0, // New field for graded resources count
                total_marks_obtained: 0, // New field for total marks obtained
                resources: {},
            };

            courseResources.forEach((resource) => {
                const resourceType = resource.resource_type.toLowerCase();

                // Initialize data for this resource type if not already present
                if (!resourceStats.resources[resourceType]) {
                    resourceStats.resources[resourceType] = {
                        total: 0,
                        submissionRequired: 0,
                        submissionsMade: 0,
                        gradedResources: 0, // New field for graded resources count
                        totalMarks: 0, // New field for total marks obtained
                        average: 0, // New field for average calculation
                    };
                }

                // Increment resource counts
                resourceStats.resources[resourceType].total++;
                if (resource.submissionRequired.toLowerCase() === 'yes') {
                    resourceStats.resources[resourceType].submissionRequired++;
                    // Track graded resources and marks
                    resourceStats.resources[resourceType].gradedResources++;
                    const studentSubmissions = submissions.filter(
                        (submission) => submission.resource.toString() === resource._id.toString()
                    );

                    studentSubmissions.forEach((submission) => {
                        if (submission.obtained_marks != null) {
                            resourceStats.resources[resourceType].totalMarks += submission.obtained_marks;
                        }
                    });
                }

                // Count submissions for this resource
                resourceStats.resources[resourceType].submissionsMade += submissions.filter(
                    (submission) => submission.resource.toString() === resource._id.toString()
                ).length;

                // Calculate the average if there are graded resources
                if (resourceStats.resources[resourceType].gradedResources > 0) {
                    const totalMarks = resourceStats.resources[resourceType].totalMarks;
                    const gradedResources = resourceStats.resources[resourceType].gradedResources;
                    resourceStats.resources[resourceType].average = (totalMarks / (gradedResources * 5)) * 100;
                }
            });

            // Update the total graded resources and total marks obtained at the course level
            resourceStats.total_graded_resources = courseResources.filter(
                (resource) => resource.submissionRequired.toLowerCase() === 'yes'
            ).length;

            resourceStats.total_marks_obtained = courseResources.reduce((acc, resource) => {
                const resourceType = resource.resource_type.toLowerCase();
                return acc + resourceStats.resources[resourceType]?.totalMarks || 0;
            }, 0);

            return resourceStats;
        });

        // Step 7: Respond with the complete report, including attendance stats
        return res.status(200).json({
            message: 'Student report generated successfully.',
            report,
            attendance: attendanceStats,
        });
    } catch (error) {
        console.error('Error generating student report:', error);
        return res.status(500).json({ message: 'Internal server error.', error });
    }
};


// module.exports = { generateStudentReport };





// const Enrolment = require('../../models/Enrolment');


const getStudentsByClassId = async (req, res) => {
    try {
        const { classId } = req.params;

        // Step 1: Find all active enrolments for the given class ID
        const enrolments = await Enrolment.find({ class_id: classId, isActive: true }).exec();

        if (enrolments.length === 0) {
            return res.status(404).json({ message: 'No students found for the given class ID.' });
        }

        // Step 2: Extract student IDs from enrolments
        const studentIds = enrolments.map((enrolment) => enrolment.student_id);

        // Step 3: Fetch user details for the student IDs
        const students = await User.find(
            { _id: { $in: studentIds } },
            'studentData.forename studentData.surname'
        ).exec();

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found for the given student IDs.' });
        }

        // Step 4: Prepare the response
        const studentDetails = students.map((student) => ({
            id: student._id,
            forename: student.studentData.forename || 'N/A',
            surname: student.studentData.surname || 'N/A',
        }));

        // Step 5: Respond with student details
        return res.status(200).json({
            message: 'Students fetched successfully.',
            students: studentDetails,
        });
    } catch (error) {
        console.error('Error fetching students by class ID:', error);
        return res.status(500).json({ message: 'Internal server error.', error });
    }
};


// const generateDetailedStudentReport = async (req, res) => {
//     try {
//         const { studentId } = req.params;
//         const { start, end } = req.body;

//         if (!start || !end) {
//             return res.status(400).json({ message: 'Start and end dates are required.' });
//         }

//         const startDate = new Date(start);
//         const endDate = new Date(end);

//         // Step 1: Get the class ID for the given student
//         const enrolment = await Enrolment.findOne({ student_id: studentId, isActive: true }).exec();
//         if (!enrolment) {
//             return res.status(404).json({ message: 'Student enrolment not found.' });
//         }
//         const classId = enrolment.class_id;

//         // Step 2: Fetch all courses related to the class ID
//         const courses = await Course.find({ class_id: classId, is_active: true }).exec();
//         if (courses.length === 0) {
//             return res.status(404).json({ message: 'No courses found for this class.' });
//         }

//         const courseIds = courses.map((course) => course._id);

//         // Step 3: Fetch all resources for the courses
//         const resources = await Resource.find({
//             course: { $in: courseIds },
//             isActive: true,
//             createdAt: { $gte: startDate, $lte: endDate },
//         }).exec();

//         if (resources.length === 0) {
//             return res.status(404).json({ message: 'No resources found for the given date range.' });
//         }

//         // Step 4: Fetch submissions for the student related to these resources
//         const submissions = await Submission.find({
//             resource: { $in: resources.map((resource) => resource._id) },
//             student_id: studentId,
//         }).exec();

//         // Step 5: Generate the report for courses and resources
//         const report = courses.map((course) => {
//             const courseResources = resources.filter(
//                 (resource) => resource.course.toString() === course._id.toString()
//             );

//             const resourceDetails = {
//                 course_name: course.course_name,
//                 assignments: [],
//                 homeworks: [],
//                 quizzes: [],
//             };

//             courseResources.forEach((resource) => {
//                 const resourceType = resource.resource_type.toLowerCase();
//                 const studentSubmissions = submissions.filter(
//                     (submission) => submission.resource.toString() === resource._id.toString()
//                 );

//                 const resourceEntry = {
//                     title: resource.title,
//                     submissionMade: studentSubmissions.length > 0 ? 'Yes' : 'No',
//                     obtained_marks: studentSubmissions.length > 0 ? studentSubmissions[0].obtained_marks || '' : '',
//                 };

//                 if (resourceType === 'assignment') {
//                     resourceDetails.assignments.push(resourceEntry);
//                 } else if (resourceType === 'homework') {
//                     resourceDetails.homeworks.push(resourceEntry);
//                 } else if (resourceType === 'quiz') {
//                     resourceDetails.quizzes.push(resourceEntry);
//                 }
//             });

//             return resourceDetails;
//         });

//         // Step 6: Respond with the complete report
//         return res.status(200).json({
//             message: 'Student report generated successfully.',
//             report,
//         });
//     } catch (error) {
//         console.error('Error generating student report:', error);
//         return res.status(500).json({ message: 'Internal server error.', error });
//     }
// };


const generateDetailedStudentReport = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { start, end } = req.body;

        if (!start || !end) {
            return res.status(400).json({ message: 'Start and end dates are required.' });
        }

        const startDate = new Date(start);
        const endDate = new Date(end);
        if (isNaN(startDate) || isNaN(endDate)) {
            return res.status(400).json({ message: 'Invalid start or end date.' });
        }

        endDate.setHours(23, 59, 59, 999);

        // Step 1: Get the class ID for the given student
        const enrolment = await Enrolment.findOne({ student_id: studentId, isActive: true }).exec();
        if (!enrolment) {
            return res.status(404).json({ message: 'Student enrolment not found.' });
        }
        const classId = enrolment.class_id;

        // Step 2: Fetch all courses related to the class ID
        const courses = await Course.find({ class_id: classId, is_active: true }).exec();
        if (courses.length === 0) {
            return res.status(404).json({ message: 'No courses found for this class.' });
        }

        const courseIds = courses.map((course) => course._id);

        // Step 3: Fetch all resources within the date range
        const resources = await Resource.find({
            course: { $in: courseIds },
            isActive: true,
            submissionRequired: 'Yes',
            createdAt: { $gte: startDate, $lte: endDate },
        })
            .sort({ createdAt: 1 })
            .exec();

        if (resources.length === 0) {
            return res.status(404).json({ message: 'No resources found for the given date range.' });
        }

        // Step 4: Fetch all submissions related to these resources
        const allSubmissions = await Submission.find({
            resource: { $in: resources.map((resource) => resource._id) },
        }).exec();

        const studentSubmissions = allSubmissions.filter((submission) => submission.student_id.toString() === studentId);

        // Step 5: Generate the report for courses and resources
        const report = courses.map((course) => {
            const courseResources = resources.filter(
                (resource) => resource.course.toString() === course._id.toString()
            );

            const resourceDetails = {
                course_name: course.course_name,
                assignments: [],
                homeworks: [],
                quizzes: [],
            };

            courseResources.forEach((resource) => {
                const studentSubmission = studentSubmissions.find(
                    (submission) => submission.resource.toString() === resource._id.toString()
                );

                // Check if the resource has been graded for any other student
                const isResourceGraded = allSubmissions.some(
                    (submission) =>
                        submission.resource.toString() === resource._id.toString() &&
                        submission.obtained_marks !== null &&
                        submission.obtained_marks !== undefined
                );

                const resourceEntry = {
                    title: resource.title,
                    submissionMade: studentSubmission ? 'Yes' : 'No',
                    obtained_marks: studentSubmission
                        ? studentSubmission.obtained_marks || ''
                        : isResourceGraded
                        ? 0
                        : '',
                    status: studentSubmission
                        ? studentSubmission.obtained_marks !== undefined && studentSubmission.obtained_marks !== null
                            ? 'GRADED'
                            : 'PENDING'
                        : isResourceGraded
                        ? 'GRADED'
                        : 'PENDING',
                    resource_details: {
                        description: resource.description,
                        due_date: resource.due_date,
                        total_marks: resource.totalMarks,
                        resource_url: resource.resource_url,
                    },
                };

                if (resource.resource_type.toLowerCase() === 'assignment') {
                    resourceDetails.assignments.push(resourceEntry);
                } else if (resource.resource_type.toLowerCase() === 'homework') {
                    resourceDetails.homeworks.push(resourceEntry);
                } else if (resource.resource_type.toLowerCase() === 'quiz') {
                    resourceDetails.quizzes.push(resourceEntry);
                }
            });

            return resourceDetails;
        });

        return res.status(200).json({
            message: 'Student report generated successfully.',
            report,
        });
    } catch (error) {
        console.error('Error generating student report:', error);
        return res.status(500).json({ message: 'Internal server error.', error });
    }
};



module.exports = { getStudentsByClassId,generateStudentReport,ClassbasedPerformance,generateDetailedStudentReport };
