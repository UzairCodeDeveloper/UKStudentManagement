import httpClient from "../../../http-commons"
import { getToken } from '../../../../util/adminUtil';

// GET ALL classes
const getAllClasses = () => {
  const token = getToken(); 
  return httpClient.get("/class/all-classes",{
     headers: {
      "x-auth-token": token, // Pass the token in the headers
    },
  });
};


// CREATE NEW class
const createNewClass = (data) => {
  const token = getToken(); // Get the token using the utility function

  return httpClient.post("/class/create-class", data, {
    headers: {
      "x-auth-token": token, // Pass the token in the headers
    },
  });
};

// Delete Class
const deleteClass = (id) => {
  const token = getToken(); // Get the token using the utility function

  return httpClient.delete(`/class/deleteClass/${id}`, {
    headers: {
      "x-auth-token": token, // Pass the token in the headers
    },
  });
};


const exportedObject = {
    getAllClasses,
    createNewClass,
    deleteClass
};



export default exportedObject;