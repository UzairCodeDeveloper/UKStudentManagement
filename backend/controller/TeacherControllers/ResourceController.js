const Resource = require('../../models/Resource');
const Submission = require('../../models/Submission');
const Course = require('../../models/Course');
const cloud = require('../../utils/cloudinaryConfig');
const { uploadToS3,getPreSignedUrl } = require("../../utils/AwsConfig"); // Import S3 utility

module.exports = {
    // Upload resource
    // uploadResource: async (req, res) => {
    //     try {
    //         const { title, description, resource_type, course_id, due_date, submissionRequired, totalMarks } = req.body;

    //         // Validate required fields
    //         if (!title || !description || !resource_type || !course_id || !submissionRequired) {
    //             return res.status(400).json({ msg: 'Title, description, resource type, course ID, and submission status are required.' });
    //         }

    //         const validResourceTypes = ['BOOK', 'ASSIGNMENT', 'SYLLABUS', 'HOMEWORK', 'OTHERS'];
    //         if (!validResourceTypes.includes(resource_type)) {
    //             return res.status(400).json({ msg: 'Invalid resource type. Use one of: BOOK, ASSIGNMENT, SYLLABUS, HOMEWORK, OTHERS.' });
    //         }

    //         const course = await Course.findById(course_id);
    //         if (!course) {
    //             return res.status(404).json({ msg: 'Course not found.' });
    //         }

    //         let resourceUrl = null;
    //         if (req.file) {
    //             const result = await cloud.uploads(req.file.path);
    //             resourceUrl = result.url;
    //         }

    //         const newResource = new Resource({
    //             course: course_id,
    //             title,
    //             description,
    //             resource_type,
    //             resource_url: resourceUrl,
    //             due_date,
    //             submissionRequired,
    //             totalMarks
    //         });

    //         await newResource.save();
    //         res.status(201).json({ success: true, data: newResource });
    //     } catch (error) {
    //         console.error('Error uploading resource:', error.message);
    //         res.status(500).json({ msg: 'Server error.' });
    //     }
    // },
    

    uploadResource: async (req, res) => {
        try {
            const { title, description, resource_type, course_id, due_date, submissionRequired, totalMarks } = req.body;
    
            // Validate required fields
            if (!title || !description || !resource_type || !course_id || !submissionRequired) {
                return res.status(400).json({ msg: "Title, description, resource type, course ID, and submission status are required." });
            }
    
            const validResourceTypes = ["BOOK", "ASSIGNMENT", "SYLLABUS", "HOMEWORK",,"QUIZ", "OTHERS"];
            if (!validResourceTypes.includes(resource_type)) {
                return res.status(400).json({ msg: "Invalid resource type. Use one of: BOOK, ASSIGNMENT, SYLLABUS, HOMEWORK, OTHERS." });
            }
    
            // Find course by ID
            const course = await Course.findById(course_id).populate('class_id'); // Populate to get the class document
            if (!course) {
                return res.status(404).json({ msg: "Course not found." });
            }
    
            // Get course_name and class_name
            const courseName = course.course_name;
            const className = course.class_id.class_name; // Assuming 'class_name' exists in the class document
    
            let resourceKey = null;
    
            // Check and upload file
            if (req.file) {
                const uploadParams = {
                    file: req.file,
                    courseName,
                    className,
                };
    
                // Pass courseName and className to S3 upload function
                const result = await uploadToS3(req.file,className,courseName,title,"Teacher");
                resourceKey = result.key; // Store the S3 key, not the URL
            }
    
            // Save resource in the database
            const newResource = new Resource({
                course: course_id,
                title,
                description,
                resource_type,
                resource_url: resourceKey, // Save key for future access
                due_date,
                submissionRequired,
                totalMarks,
            });
    
            await newResource.save();
            res.status(201).json({ success: true, data: newResource });
        } catch (error) {
            console.error("Error uploading resource:", error.message);
            res.status(500).json({ msg: "Server error." });
        }
    },
    

getPreSignedUrlController: async (req, res) => {
    try {
        const { fileKey } = req.body; // Extract fileKey from request body
        if (!fileKey) {
            return res.status(400).json({ message: 'File key is required' });
        }
        const preSignedUrl = await getPreSignedUrl(fileKey); // Generate pre-signed URL
        res.status(200).json({ success: true, message: 'Pre-signed URL generated successfully', preSignedUrl });
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        res.status(500).json({ success: false, message: 'Error generating pre-signed URL', error: error.message });
    }
},







    // Update resource
    updateResource: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, resource_type, due_date, submissionRequired } = req.body;

            const resource = await Resource.findById(id);
            if (!resource) {
                return res.status(404).json({ msg: 'Resource not found.' });
            }

            if (req.file) {
                const result = await cloud.uploads(req.file.path);
                resource.resource_url = result.url;
            }

            resource.title = title || resource.title;
            resource.description = description || resource.description;
            resource.resource_type = resource_type || resource.resource_type;
            resource.due_date = due_date || resource.due_date;
            resource.submissionRequired = submissionRequired || resource.submissionRequired;

            await resource.save();
            res.status(200).json({ success: true, data: resource });
        } catch (error) {
            console.error('Error updating resource:', error.message);
            res.status(500).json({ msg: 'Server error.' });
        }
    },

    // Get all resources for a course
    getResourcesByCourse: async (req, res) => {
        try {
            const { course_id } = req.params;

            const resources = await Resource.find({ course: course_id }).lean();
            if (!resources.length) {
                return res.status(404).json({ msg: 'No resources found for this course.' });
            }

            res.status(200).json({ success: true, data: resources });
        } catch (error) {
            console.error('Error fetching resources:', error.message);
            res.status(500).json({ msg: 'Server error.' });
        }
    },

    // Get a single resource by ID
    getResourceById: async (req, res) => {
        try {
            const { id } = req.params;
            const userID = req.user.id;

            const resource = await Resource.findById(id);
            if (!resource) {
                return res.status(404).json({ msg: 'Resource not found.' });
            }

            const submission = await Submission.findOne({ resource: id, student_id: userID });
            if (submission) {
                return res.status(200).json({ isSubmitted: true, success: true, data: resource, submission: submission });
            }

            res.status(200).json({ isSubmitted: false, success: true, data: resource });
        } catch (error) {
            console.error('Error fetching resource:', error.message);
            res.status(500).json({ msg: 'Server error.' });
        }
    },

    // Delete resource
    deleteResource: async (req, res) => {
        try {
            const { id } = req.params;

            const resource = await Resource.findById(id);
            if (!resource) {
                return res.status(404).json({ msg: 'Resource not found.' });
            }

            // Optionally delete the file from Cloudinary
            if (resource.resource_url) {
                // await cloud.delete(resource.resource_url);
            }

            await Resource.findByIdAndDelete(id);
            res.status(200).json({ success: true, msg: 'Resource deleted successfully.' });
        } catch (error) {
            console.error('Error deleting resource:', error.message);
            res.status(500).json({ msg: 'Server error.' });
        }
    },

    // Grade resource
    // gradeResource: async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const { marks } = req.body;

    //         if (marks == null || isNaN(marks) || marks < 0) {
    //             return res.status(400).json({ msg: 'Marks must be a non-negative number.' });
    //         }

    //         const resource = await Resource.findById(id);
    //         if (!resource) {
    //             return res.status(404).json({ msg: 'Resource not found.' });
    //         }

    //         resource.totalMarks = marks;

    //         await resource.save();
    //         res.status(200).json({ success: true, data: resource });
    //     } catch (error) {
    //         console.error('Error grading resource:', error.message);
    //         res.status(500).json({ msg: 'Server error.' });
    //     }
    // },
};
