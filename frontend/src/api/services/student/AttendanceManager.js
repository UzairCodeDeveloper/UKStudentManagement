import httpClient from "../../http-commons";
import { getToken } from '../../../util/adminUtil';

const getAttendanceByMonthAndYear = () => {
    const token = getToken();
    return httpClient.get(`/attendence/get-my-attendance/`, {
        headers: {
            "x-auth-token": token,
        },
    });
};






const exportedObject = {
    getAttendanceByMonthAndYear
};

export default exportedObject;
