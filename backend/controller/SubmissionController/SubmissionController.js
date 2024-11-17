const Submission = require('../../models/Submission');
const cloud = require('../../utils/cloudinaryConfig');


// Add and Update Submission (Student)
exports.addSubmission = async (req, res) => {
    const { resource } = req.body;
    const student_id = req.user.id;

    // Validate required fields
    if (!resource || !student_id) {
        return res.status(400).json({ success: false, message: 'Resource and student ID are required' });
    }

    try {
        let submissionUrl = null;

        // Check if a file is uploaded
        if (req.file) {
            const result = await cloud.uploads(req.file.path);
            submissionUrl = result.url;
        } else {
            return res.status(400).json({ success: false, message: 'File upload is required' });
        }

        // Check if a submission already exists for the same resource and student
        const existingSubmission = await Submission.findOne({ resource, student_id });

        if (existingSubmission) {
            // Update the existing submission
            existingSubmission.submission_url = submissionUrl;
            existingSubmission.updated_at = Date.now(); // Optional: Add a timestamp for tracking updates
            await existingSubmission.save();

            return res.status(200).json({
                success: true,
                message: 'Submission updated successfully',
                submission: existingSubmission,
            });
        }

        // If no submission exists, create a new one
        const newSubmission = new Submission({
            resource,
            student_id,
            submission_url: submissionUrl,
        });

        await newSubmission.save();

        res.status(201).json({
            success: true,
            message: 'Submission added successfully',
            submission: newSubmission,
        });
    } catch (error) {
        console.error('Error adding/updating submission:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};



exports.getSubmissionsByResource = async (req, res) => {
    const { resourceId } = req.params;

    // Validate required fields
    if (!resourceId) {
        return res.status(400).json({ success: false, message: 'Resource ID is required' });
    }

    try {
        const submissions = await Submission.find({ resource: resourceId })
            .populate({
                path: 'student_id', // Path to the user document
                select: 'roll_number studentData.forename studentData.surname', // Select only the desired fields
            })
            .populate({
                path:'resource',
                select: 'title description totalMarks'
});
            

        if (!submissions.length) {
            return res.status(404).json({ success: false, message: 'No submissions found for this resource' });
        }

        res.status(200).json({ success: true, submissions });
    } catch (error) {
        console.error('Error fetching submissions:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update Marks for a Submission (Teacher)
exports.updateSubmissionMarks = async (req, res) => {
    const { submissionId } = req.params;
    const { obtained_marks } = req.body;

    // validate required fields
    if (!submissionId || !obtained_marks) {
        return res.status(400).json({ success: false, message: 'Submission ID and obtained marks are required' });
    }


    try {
        const submission = await Submission.findByIdAndUpdate(
            submissionId,
            { obtained_marks },
            { new: true }
        );

        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission not found' });
        }

        res.status(200).json({ success: true, message: 'Marks updated successfully', submission });
    } catch (error) {
        console.error('Error updating marks:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get Submissions for a Student (Student)
exports.getSubmissionsByStudent = async (req, res) => {
    const { studentId } = req.params;

    // validate required fields
    if (!studentId) {
        return res.status(400).json({ success: false, message: 'Student ID is required  ' });
    }

    try {
        const submissions = await Submission.find({ student_id: studentId }).populate('resource', 'title resource_type');

        if (!submissions.length) {
            return res.status(404).json({ success: false, message: 'No submissions found for this student' });
        }

        res.status(200).json({ success: true, submissions });
    } catch (error) {
        console.error('Error fetching submissions:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get Submission by Submission ID
exports.getSubmissionById = async (req, res) => {
    const { submissionId } = req.params;

    // Validate required field
    if (!submissionId) {
        return res.status(400).json({ success: false, message: 'Submission ID is required' });
    }

    try {
        // Find the submission by the given submissionId
        const submission = await Submission.findById(submissionId)
            .populate({
                path: 'resource', // Populating the resource data
                select: 'title description totalMarks', // Specify the fields you want from the resource model
            })
            .populate({
                path: 'student_id', // Populating student data
                select: 'roll_number studentData.forename studentData.surname email', // Select relevant student fields
            });

        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission not found' });
        }

        res.status(200).json({ success: true, submission });
    } catch (error) {
        console.error('Error fetching submission by ID:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Update Marks for a Submission (Teacher)
exports.markSubmissionMarks = async (req, res) => {
    const {submissionId, obtained_marks } = req.body;

    // Validate required fields
    if (!submissionId || obtained_marks === undefined) {
        return res.status(400).json({ success: false, message: 'Submission ID and obtained marks are required' });
    }

    try {
        // Find the submission by submissionId and update the obtained_marks
        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({ success: false, message: 'Submission not found' });
        }

        // Update the obtained_marks field
        submission.obtained_marks = obtained_marks;
        submission.status = 'GRADED'; // Update the status to GRADED

        // Save the updated submission
        await submission.save();

        res.status(200).json({ success: true, message: 'Marks updated successfully', submission });
    } catch (error) {
        console.error('Error marking submission:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};