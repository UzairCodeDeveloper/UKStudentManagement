import httpClient from "../../http-commons";
import { getToken } from '../../../util/adminUtil';



// Mark or update attendance for a specific date
const loginFamily = (data) => {
    // const token = getToken();
    return httpClient.post(`/family/login`, data, {
    });
};

const getfamilystudents = () => {
    const token = getToken();

    return httpClient.get("/family/getfam/students", {
        headers: {
            "x-auth-token": token,
        },
    });
};

const getStudentCoursePercentage = (studentId) => {
    const token = getToken();
    return httpClient.get(`/family/percentage/${studentId}`, {
      headers: {
        "x-auth-token": token,
      },
    });
  };
  

  const getStudentAttendancebyid = (studentId) => {
    const token = getToken(); // Get token from Redux state or other source
    // console.log(data)
    return httpClient.get(`/family/attendance/${studentId}`, {
      headers: {
        "x-auth-token": token, // Pass the token in the headers correctly
      },
    });
  };

  const getAbsentees = (data) => {
    const token = getToken(); // Get token from Redux state or other source
    // console.log(token)
    return httpClient.put("/family/getabsentees",data, {
      headers: {
        "x-auth-token": token, // Pass the token in the headers correctly
      },
    });
  };
 
  const updateReason = (data) => {
    const token = getToken(); // Get token from Redux state or other source
    // console.log(token)
    return httpClient.put("/family/updatereasonforleave",data, {
      headers: {
        "x-auth-token": token, // Pass the token in the headers correctly
      },
    });
  };
  

  const getFees = (data) => {
    const token = getToken(); 
    console.log("hllle"+data)
    return httpClient.post("/fees/familyfees",data );
  };

const exportedObject = {

    loginFamily,
    getfamilystudents,
    getStudentCoursePercentage
    ,getStudentAttendancebyid,
    getAbsentees,
    updateReason,
    getFees
};

export default exportedObject;
