import httpClient from "../../../http-commons";
import { getToken } from '../../../../util/adminUtil';

// Fetch attendance records for a specific date
const getAttendanceRecordByDate = (date) => {
    const token = getToken();
    return httpClient.get(`/teacher-attendance/teacher-attendance/${date}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};

const getAttendanceRecordByClassAndDate = (class_id,date) => {
    const token = getToken();

    return httpClient.get(`/teacher-attendance/fetchrecords/${class_id}/${date}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};


const getReasonRecordByClassAndDate = (class_id,date) => {
    const token = getToken();

    return httpClient.get(`/teacher-attendance/fetchreasons/${class_id}/${date}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};



// Mark or Teacher update attendance for a specific date
const markAttendance = (data) => {
    const token = getToken();
    return httpClient.post(`/teacher-attendance/markteacherattendanceadmin`, data, {
        headers: {
            "x-auth-token": token,
        },
    });
};

const markStudentAttendance = (data) => {
    // console.log(data)
    const token = getToken(); // Get token from Redux state or other source
    // console.log(data)
    return httpClient.post(`/attendence/markstudentattendanceadmin`, data, {
        headers: {
            "x-auth-token": token, // Pass the token in the headers correctly
        },
    });
};

const exportedObject = {
    getAttendanceRecordByDate,
    markAttendance,
    getAttendanceRecordByClassAndDate,
    markStudentAttendance,
    getReasonRecordByClassAndDate
};

export default exportedObject;
