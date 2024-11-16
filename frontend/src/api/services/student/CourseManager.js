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




const exportedObject = {
    getDetailedCourse,
    getCourseForStudent
};

export default exportedObject;
