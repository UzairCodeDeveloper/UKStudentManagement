import httpClient from "../../http-commons";
// import { getToken } from '../../../util/adminUtil';



// Mark or update attendance for a specific date
const loginFamily = (data) => {
    // const token = getToken();
    return httpClient.post(`/family/login`, data, {
    });
};

const exportedObject = {

    loginFamily
};

export default exportedObject;
