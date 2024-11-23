import httpClient from "../../../http-commons"; 
import { getToken } from '../../../../util/adminUtil'; 

const createAnnouncement = (data) => {
    const token = getToken(); 
    return httpClient.post("/Announcement", data, {
      headers: {
        "x-auth-token": token,  
      },
    });
};


const AnnouncementApi={
    createAnnouncement
}

export default AnnouncementApi;