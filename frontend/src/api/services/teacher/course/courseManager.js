import httpClient from "../../../http-commons"
import { getToken } from '../../../../util/adminUtil';


// GET ALL Teacher Courses
const getAllTeacherCourses = () => {
  const token = getToken(); // Get token from Redux state or other source

  return httpClient.get("/course/my-courses/getALL", {
    headers: {
      "x-auth-token": token, // Pass the token in the headers correctly
    },
  });
};

const getCourseByIdInstructor = (id) => {
  const token = getToken(); // Get token from Redux state or other source

  return httpClient.get(`/course/my-courses/${id}`, {
    headers: {
      "x-auth-token": token, // Pass the token in the headers
    },
  });
};



const exportedObject = {
    getAllTeacherCourses,
    getCourseByIdInstructor
};



export default exportedObject;