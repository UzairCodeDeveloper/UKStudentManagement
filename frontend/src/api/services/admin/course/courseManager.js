import httpClient from "../../../http-commons"
import { getToken } from '../../../../util/adminUtil';



// GET ALL classes
const getAllCourses = () => {
  const token = getToken(); // Get token from Redux state or other source

  return httpClient.get("/course/get-courses", {
    headers: {
      "x-auth-token": token, // Pass the token in the headers correctly
    },
  });
};


// CREATE NEW class
const createNewClass = (data) => {
  const token = getToken(); // Get token from Redux state or other source


  return httpClient.post("/course/create-course", data, {
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