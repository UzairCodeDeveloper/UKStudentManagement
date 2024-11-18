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

// Mark or update attendance for a specific date
const markAttendance = (data) => {
    const token = getToken();
    return httpClient.post(`/teacher-attendance`, data, {
        headers: {
            "x-auth-token": token,
        },
    });
};

const exportedObject = {
    getAttendanceRecordByDate,
    markAttendance
};

export default exportedObject;
