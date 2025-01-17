import httpClient from "../../../http-commons"; 
import { getToken } from '../../../../util/adminUtil'; 

const getStudentsbyClassid = (class_id) => {
    const token = getToken();

    return httpClient.get(`/report/getStudentsbyclassid/${class_id}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};

const getSummerizedStudentReport = (student_id) => {
    const token = getToken();

    return httpClient.get(`/report/generateStudentReport/${student_id}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};


const getDetailedStudentReport = (student_id,Data) => {
    const token = getToken();

    return httpClient.post(`/report/generateDetailedStudentReport/${student_id}`,Data, {
        headers: {
            "x-auth-token": token,
        },
    });
};
const getClassbasedPerformance = (class_id) => {
    const token = getToken();

    return httpClient.get(`/report/classbasedperformance/${class_id}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};

// Exporting all session-related API methods
const sessionApi = {
    getSummerizedStudentReport,
    getStudentsbyClassid,
    getClassbasedPerformance,
    getDetailedStudentReport
};

export default sessionApi;
