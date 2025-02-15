import httpClient from "../../../http-commons";
import { getToken } from '../../../../util/adminUtil';

// GET ALL Teacher's Classes for ATTENDANCE
const getAllAssignedClasses = () => {
    const token = getToken();

    return httpClient.get("/attendence/classes", {
        headers: {
            "x-auth-token": token,
        },
    });
};

// Get Attendance by Class and Date (FETCH RECORD)
const getAttendanceRecordByClassAndDate = (class_id,date) => {
    const token = getToken();

    return httpClient.get(`/attendence/fetchrecords/${class_id}/${date}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};

const getAttendance = () => {
    const token = getToken();
    return httpClient.get('/teacher-attendance/search-by-teacher', {
        headers: {
            "x-auth-token": token,
        },
    });
};

// MARK ATTENDANCE
const markAttendance = (data) => {
    // console.log(data)
    const token = getToken(); // Get token from Redux state or other source
    // console.log(data)
    return httpClient.post(`/attendence/markattendance`, data, {
        headers: {
            "x-auth-token": token, // Pass the token in the headers correctly
        },
    });
};

const exportedObject = {
    getAllAssignedClasses,
    getAttendanceRecordByClassAndDate,
    markAttendance,
    getAttendance
};

export default exportedObject;
