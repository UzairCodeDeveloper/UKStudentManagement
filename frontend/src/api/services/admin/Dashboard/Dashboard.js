import httpClient from "../../../http-commons"; 
import { getToken } from '../../../../util/adminUtil'; 



const getDashboardRecord = () => {
    const token = getToken();   
    return httpClient.get("/dashboard", {
      headers: {
        "x-auth-token": token,  
      },
    });
};

const adminDashboardApi = {
    getDashboardRecord,
};

export default adminDashboardApi;