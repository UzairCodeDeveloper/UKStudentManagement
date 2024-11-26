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
  
 
  

const exportedObject = {

    loginFamily,
    getfamilystudents,
    getStudentCoursePercentage
};

export default exportedObject;
