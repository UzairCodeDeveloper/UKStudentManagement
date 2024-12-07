import httpClient from "../../../http-commons"; 
import { getToken } from '../../../../util/adminUtil'; 



const getCredentialsRecord = () => {
    const token = getToken(); 
    return httpClient.get("/password/security", {
      headers: {
        "x-auth-token": token,  
      },
    });
  };


  
  

  
  const FeesApi={
   
    getCredentialsRecord,
}

export default FeesApi;