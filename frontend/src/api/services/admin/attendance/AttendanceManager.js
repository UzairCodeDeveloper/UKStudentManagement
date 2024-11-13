import httpClient from "../../../http-commons";
import { getToken } from '../../../../util/adminUtil';



// Get Teacher Attendance Record By Date
const getAttendanceRecordByDate = (date) => {
    const token = getToken();

    return httpClient.get(`/teacher-attendance/teacher-attendance/${date}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};



// MARK ATTENDANCE FOR TEACHER
const markAttendance = (data) => {
    // console.log(data)
    const token = getToken(); // Get token from Redux state or other source
    // console.log(data)
    return httpClient.post(`/teacher-attendance`, data, {
        headers: {
            "x-auth-token": token, // Pass the token in the headers correctly
        },
    });
};

const exportedObject = {
    getAttendanceRecordByDate,
    markAttendance
};

export default exportedObject;
