import httpClient from "../../../http-commons"; 
import { getToken } from '../../../../util/adminUtil'; 



const updateProfilePassword = (Data) => {
    const token = getToken();

    return httpClient.put("/userprofile/updatepassword",Data, {
        headers: {
            "x-auth-token": token,
        },
    });
};


  
  

  
  const FeesApi={
   
    updateProfilePassword,
}

export default FeesApi;