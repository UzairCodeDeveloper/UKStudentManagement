import httpClient from "../../../http-commons"
import { getToken } from '../../../../util/adminUtil';


const deleteCourse = (id) => {
    const token = getToken(); // Get the token using the utility function
    return httpClient.delete(`/course/${id}`, {
      headers: {
        "x-auth-token": token, // Pass the token in the headers
      },
    });
  };

  const getAllCourses = () => {
    const token = getToken(); // Get token from Redux state or other source
    return httpClient.get("/course/get-courses", {
      headers: {
        "x-auth-token": token, // Pass the token in the headers correctly
      },
    });
  };

  const createNewClass = (data) => {
    const token = getToken(); // Get the token using the utility function
    return httpClient.post("/course/create-course", data, {
      headers: {
        "x-auth-token": token, // Pass the token in the headers
      },

    });
    }

  const getCourseById = (id) => {
    const token = getToken(); // Get token from Redux state or other source
    return httpClient.get(`/course/${id}`, {
      headers: {
        "x-auth-token": token, // Pass the token in the headers correctly
      },
    });
  };
  const UpdateCourse = (id,data) => {
    const token = getToken(); // Get token from Redux state or other source
    console.log(data)
    return httpClient.put(`/course/${id}`,data, {
      headers: {
        "x-auth-token": token, // Pass the token in the headers correctly
      },
    });
  };


const exportedObject = {
  
    deleteCourse,
    getAllCourses,
    createNewClass
    ,getCourseById,
    UpdateCourse
};



export default exportedObject;