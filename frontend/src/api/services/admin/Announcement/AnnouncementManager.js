import httpClient from "../../../http-commons"; 
import { getToken } from '../../../../util/adminUtil'; 


const createAnnouncement = (data) => {
    const token = getToken(); 
    return httpClient.put("/announcement", data, {
      headers: {
        "x-auth-token": token,  
      },
    });
};


const getAnnouncement = () => {
  const token = getToken(); 
  return httpClient.get("/announcement/get-Announcements", {
    headers: {
      "x-auth-token": token,  
    },
  });
};

const AnnouncementApi={
    createAnnouncement
    ,getAnnouncement
}

export default AnnouncementApi;