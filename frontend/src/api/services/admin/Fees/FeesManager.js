import httpClient from "../../../http-commons"; 
import { getToken } from '../../../../util/adminUtil'; 



const getFeesRecord = () => {
    const token = getToken(); 
    return httpClient.get("/fees/fees", {
      headers: {
        "x-auth-token": token,  
      },
    });
  };

  const updateRecord = (data) => {
    const token = getToken(); 
    console.log(data)
    return httpClient.put("/fees/fees",data ,{
      headers: {
        "x-auth-token": token,  
      },
    });
  };

  const FeesApi={
   
    getFeesRecord,
    updateRecord
}

export default FeesApi;