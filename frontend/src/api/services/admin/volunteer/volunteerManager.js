import httpClient from "../../../http-commons"
import { getToken } from '../../../../util/adminUtil';



// GET ALL Volunteers
const getAllVolunteers = () => {
  const token = getToken(); // Get token from Redux state or other source

  return httpClient.get("/volunteer/get-all", {
    headers: {
      "x-auth-token": token, // Pass the token in the headers correctly
    },
  });
};


// CREATE NEW Volunteer
const createNewVolunteer = (data) => {
  const token = getToken(); // Get token from Redux state or other source


  return httpClient.post("/volunteer/", data, {
    headers: {
      "x-auth-token": token, // Pass the token in the headers
    },
  });
};


// Delete Volunteer
const deleteVolunteer = (id) => {
  const token = getToken(); // Get token from Redux state or other source


  return httpClient.delete(`/volunteer/delete/${id}`, {
    headers: {
      "x-auth-token": token, // Pass the token in the headers
    },
  });
};



const exportedObject = {
    createNewVolunteer,
    getAllVolunteers,
    deleteVolunteer
};



export default exportedObject;