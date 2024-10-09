import httpClient from "../../../http-commons"
import { getToken } from '../../../../util/adminUtil';

// GET ALL classes
const getAllCourses = () => {
  return httpClient.get("/course/get-courses");
};


// CREATE NEW class
const createNewClass = (data) => {
  const token = getToken(); // Get the token using the utility function

  return httpClient.post("/class/create-class", data, {
    headers: {
      "x-auth-token": token, // Pass the token in the headers
    },
  });
};


const exportedObject = {
    getAllCourses,
    createNewClass
};



export default exportedObject;