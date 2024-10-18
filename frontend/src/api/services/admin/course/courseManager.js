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



const exportedObject = {
    deleteCourse,
    getAllCourses,
    createNewClass
};



export default exportedObject;