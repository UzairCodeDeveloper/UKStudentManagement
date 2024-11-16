import httpClient from "../../http-commons";
import { getToken } from '../../../util/adminUtil';

const getAttendanceByMonthAndYear = (month,year) => {
    const token = getToken();
    return httpClient.get(`/attendence/get-my-attendance/${month}/${year}`, {
        headers: {
            "x-auth-token": token,
        },
    });
};






const exportedObject = {
    getAttendanceByMonthAndYear
};

export default exportedObject;
