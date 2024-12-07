
const Credentials = require('../../models/Credentials'); // Adjust path to your Credentials model
const Families = require('../../models/Family'); // Adjust path to your Families model

// Fetch all user and family credentials
const fetchAllCredentials = async (req, res) => {
    try {
      // Fetch all student credentials
      const studentCredentials = await Credentials.find();
  
      // Extract unique familyRegNo IDs
      const familyIds = studentCredentials.map((cred) => cred.familyRegNo);
  
      // Fetch family credentials
      const familyCredentials = await Families.find({ _id: { $in: familyIds } });
  
      // Prepare response with full details
      const response = [];
  
      // Add family credentials to response
      familyCredentials.forEach((family) => {
        response.push({
          id: family._id,
          username: family.familyRegNo, // Assuming the field in Families collection
          password: family.password,
        });
      });
  
      // Add student credentials to response
      studentCredentials.forEach((student) => {
        response.push({
          id: student._id,
          username: student.username,
          password: student.password,
        });
      });
  
      // Send the response
      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
  };
  

module.exports = {
  fetchAllCredentials,
};
