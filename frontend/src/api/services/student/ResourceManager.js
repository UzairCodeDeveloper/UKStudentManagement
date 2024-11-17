import httpClient from "../../http-commons";
import { getToken } from '../../../util/adminUtil';

const getResourceByID = (id) => {
    const token = getToken();
    return httpClient.get(`/resources/${id}/refine`, {
        headers: {
            "x-auth-token": token,
        },
    });
};

// Function to submit resource along with file
const submitResource = async (resourceId, file) => {
    const token = getToken();
    
    // Create a new FormData object to send file data and resource ID
    const formData = new FormData();
    formData.append('file', file); // Append the file
    formData.append('resource', resourceId); // Append the resource ID

    try {
        // Sending the form data with an authorization token
        const response = await httpClient.post('/submission/submit', formData, {
            headers: {
                "x-auth-token": token,
                "Content-Type": "multipart/form-data", // Important for file uploads
            },
        });

        // Handle successful response
        if (response.data.success) {
            console.log("Submission added/updated successfully:", response.data.submission);
            return response.data.submission; // Return submission details or handle as needed
        } else {
            console.error("Error:", response.data.message);
            return null; // Handle error
        }
    } catch (error) {
        console.error("Error submitting resource:", error);
        return null; // Handle unexpected errors
    }
};

const getAllSubmissionsByResourceID = (id) => {
    const token = getToken();
    return httpClient.get(`/submission/resource/${id}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};

// submit grades
// Function to submit resource along with file
const saveMarks = async (data) => {
    const token = getToken();
        return await httpClient.put('/submission/grade', data, {
            headers: {
                "x-auth-token": token,
            },
        });


};





const exportedObject = {
    getResourceByID,
    submitResource,
    getAllSubmissionsByResourceID,
    saveMarks
};

export default exportedObject;
