import httpClient from "../../http-commons";
import { getToken } from "../../../../util/adminUtil";


// POST API: Create a timetable entry (Token required, body required)
const createTimetable = (data) => {
    const token = getToken(); // Get token dynamically
    return httpClient.post(
        "/time-table/",
        data,
        {
            headers: {
                "x-auth-token": token, // Pass the token in the headers correctly
            },
        }
    );
};

// GET API: Get timetable by class (Token not required)
const getTimetableByClass = (classId) => {
    return httpClient.get(`/time-table/class/${classId}`);
};

// GET API: Get timetable by teacher (Token not required)
const getTimetableByTeacher = (teacherId) => {
    return httpClient.get(`/time-table/teacher/${teacherId}`);
};

// DELETE API: Delete a timetable entry (Token required)
const deleteTimetable = (timetableId) => {
    const token = getToken(); // Get token dynamically
    return httpClient.delete(
        `/time-table/delete/${timetableId}`,
        {
            headers: {
                "x-auth-token": token, // Pass the token in the headers correctly
            },
        }
    );
};

const exportedObject = {
    createTimetable,
    getTimetableByClass,
    getTimetableByTeacher,
    deleteTimetable,
};

export default exportedObject;
