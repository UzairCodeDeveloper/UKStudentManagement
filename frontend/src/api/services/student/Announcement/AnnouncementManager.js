import httpClient from "../../../http-commons"; 
import { getToken } from '../../../../util/adminUtil'; 



const getAnnouncement = () => {
    const token = getToken(); 
    return httpClient.get("/announcement/student", {
      headers: {
        "x-auth-token": token,  
      },
    });
  };

  const AnnouncementApi={
   
    getAnnouncement
}

export default AnnouncementApi;