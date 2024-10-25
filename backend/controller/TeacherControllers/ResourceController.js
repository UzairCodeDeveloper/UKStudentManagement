const Resource = require('../../models/Resource');
const Course = require('../../models/Course');
const cloud = require('../../utils/cloudinaryConfig');

// Controller for managing resources
module.exports = {
    // Upload resource
    uploadResource: async (req, res) => {
        try {
            const { title, description, resource_type, course_id } = req.body;
    
            // Validating the required fields
            if (!title) {
                return res.status(400).json({ msg: 'Title is required' });
            }
    
            if (!resource_type) {
                return res.status(400).json({ msg: 'Resource type is required' });
            }
    
            const validResourceTypes = ['BOOK', 'ASSIGNMENT', 'SYLLABUS', 'HOMEWORK', 'OTHERS'];
            if (!validResourceTypes.includes(resource_type)) {
                return res.status(400).json({ msg: 'Select a valid resource type (ASSIGNMENT, BOOK, SYLLABUS, HOMEWORK, OTHERS)' });
            }
    
            if (!course_id) {
                return res.status(400).json({ msg: 'Course ID is required' });
            }
    
            // Check if course exists
            const course = await Course.findById(course_id);
            if (!course) {
                return res.status(404).json({ msg: 'Course not found' });
            }
    
            // Check if the file is required based on resource type (for BOOK)
            let resourceUrl = null;
            if (resource_type === 'BOOK') {
                if (!req.file) {
                    return res.status(400).json({ msg: 'File is required for BOOK resource type' });
                }
    
                // Upload file to Cloudinary if file exists
                const result = await cloud.uploads(req.file.path);
                resourceUrl = result.url;
            } else {
                // If resource type is not BOOK, file is optional
                if (req.file) {
                    // Upload file if present for non-BOOK types
                    const result = await cloud.uploads(req.file.path);
                    resourceUrl = result.url;
                }
            }
    
            // Create new resource
            const newResource = new Resource({
                course: course_id,
                title,
                description,
                resource_type,
                resource_url: resourceUrl, // File URL or null
            });
    
            await newResource.save();
    
            res.status(201).json({ success: true, data: newResource });
    
        } catch (error) {
            console.error('Error uploading resource:', error.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    },
    // Get all resources for a course
    getResourcesByCourse: async (req, res) => {
        try {
            const { course_id } = req.params;

            // Fetch all resources for the given course
            const resources = await Resource.find({ course:course_id }).lean();

            if (!resources) {
                return res.status(404).json({ msg: 'No resources found for this course' });
            }

            res.status(200).json({ success: true, data: resources });

        } catch (error) {
            console.error('Error fetching resources:', error.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    },

    // Delete resource by ID
    deleteResource: async (req, res) => {
        try {
            const { id } = req.params;

            // Check if resource exists
            const resource = await Resource.findById(id);
            if (!resource) {
                return res.status(404).json({ msg: 'Resource not found' });
            }

            // Optionally delete the file from Cloudinary
            // await cloud.delete(resource.resource_url);

            // Delete the resource
            await Resource.findByIdAndDelete(id);

            res.status(200).json({ success: true, msg: 'Resource deleted successfully' });

        } catch (error) {
            console.error('Error deleting resource:', error.message);
            res.status(500).json({ msg: 'Server Error' });
        }
    },
};
