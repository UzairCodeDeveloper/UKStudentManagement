import httpClient from "../../../http-commons"; 
import { getToken } from '../../../../util/adminUtil'; 



const getBookLink = (data) => {
    const token = getToken(); 
    return httpClient.post("/getbook/books",data, {
      headers: {
        "x-auth-token": token,  
      },
    });
  };

  const AnnouncementApi={
   
    getBookLink
}

export default AnnouncementApi;