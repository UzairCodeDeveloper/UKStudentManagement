import httpClient from "../../http-commons";
// GET ALL Teacher's Classes for ATTENDANCE
const userLogin = (data) => {
    return httpClient.post("/users/login", data);
};



const exportedObject = {
    userLogin
};

export default exportedObject;
