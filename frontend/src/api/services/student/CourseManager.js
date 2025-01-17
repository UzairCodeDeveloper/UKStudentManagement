import httpClient from "../../http-commons";
import { getToken } from '../../../util/adminUtil';

const getDetailedCourse = (id) => {
    const token = getToken();
    return httpClient.get(`/resources/student-resources/${id}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};


const getCourseForStudent = (id) => {
    const token = getToken();
    return httpClient.get(`/course/student/get-courses/${id}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};

const getPreSignedUrl = (fileKey) => {
  const token = getToken(); // Get the token from Redux state or elsewhere
  // console.log(fileKey); // Log to verify the fileKey

  return httpClient.put("/resources/getPresignedUrlforStudent", {fileKey}, {
    headers: {
      "x-auth-token": token,   
    },
  });
};

const getBookLink = (data) => {
    const token = getToken(); 
    return httpClient.post("/getbook/Studentbooks",data, {
      headers: {
        "x-auth-token": token,  
      },
    });
  };



const exportedObject = {
    getDetailedCourse,
    getCourseForStudent,
    getPreSignedUrl,
    getBookLink
};

export default exportedObject;
