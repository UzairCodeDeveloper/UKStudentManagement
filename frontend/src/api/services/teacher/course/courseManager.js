import httpClient from "../../../http-commons";
import { getToken } from '../../../../util/adminUtil';

// GET ALL Teacher Courses
const getAllTeacherCourses = () => {
  const token = getToken();  

  return httpClient.get("/course/my-courses/getALL", {
    headers: {
      "x-auth-token": token,   
    },
  });
};

// GET a course by ID for the instructor
const getCourseByIdInstructor = (id) => {
  const token = getToken(); // Get token from Redux state or other source

  return httpClient.get(`/course/my-courses/${id}`, {
    headers: {
      "x-auth-token": token,  
    },
  });
};

// UPLOAD a new resource
const uploadResource = (resourceData) => {
  const token = getToken();  
  console.log(resourceData)
  // Use FormData for file uploads
  const formData = new FormData();
  formData.append("title", resourceData.title);
  formData.append("description", resourceData.description);
  formData.append("resource_type", resourceData.resource_type);
  formData.append("course_id", resourceData.course_id);
  formData.append("due_date", resourceData.due_date);
  formData.append("submissionRequired", resourceData.submissionRequired);
  formData.append("totalMarks", resourceData.totalMarks);
  if (resourceData.pdf) {
    formData.append("pdf", resourceData.pdf); // Attach the file if it exists
  }


  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }
  console.log(formData)
  return httpClient.post("/resources/upload", formData, {
    headers: {
      "x-auth-token": token,  
      "Content-Type": "multipart/form-data", // Use multipart for file upload
    },
  });
};

// GET all resources by course
const getResourcesByCourse = (course_id) => {
  const token = getToken();  
  return httpClient.get(`/resources/${course_id}`, {
    headers: {
      "x-auth-token": token,  
    },
  });
};

// DELETE a resource by ID
const deleteResource = (resource_id) => {
  const token = getToken();  

  return httpClient.delete(`/resources/${resource_id}`, {
    headers: {
      "x-auth-token": token,  
    },
  });
};

const getResourcebyId = (id) => {
  const token = getToken(); // Get token from Redux state or other source

  return httpClient.get(`/resources/get/${id}`, {
    headers: {
      "x-auth-token": token, // Pass the token in the headers correctly
    },
  });
};

const updateResource = (id,data) => {
  const token = getToken(); // Get token from Redux state or other source
  console.log(data)
  return httpClient.put(`/resources/update/${id}`,data, {
    headers: {
      "x-auth-token": token, // Pass the token in the headers correctly
    },
  });
};

const getAllStudentCourses = () => {
  const token = getToken();  

  return httpClient.get("/course/student/getALL", {
    headers: {
      "x-auth-token": token,   
    },
  });
};

const exportedObject = {
  getAllTeacherCourses,
  getCourseByIdInstructor,
  uploadResource,       
  getResourcesByCourse,
  deleteResource,
  getResourcebyId   
  ,updateResource    ,
  getAllStudentCourses
};

export default exportedObject;
