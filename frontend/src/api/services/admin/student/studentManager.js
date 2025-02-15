import httpClient from "../../../http-commons"
import { getToken } from '../../../../util/adminUtil';




const getAllFamilyNo = () => {
  const token = getToken(); 
  return httpClient.get("/family",{
     headers: {
      "x-auth-token": token, // Pass the token in the headers
    },
  });
};

// GET ALL Students
const getAllStudents = () => {
  const token = getToken(); // Get token from Redux state or other source

  return httpClient.get("/users/getAllUsers/student", {
    headers: {
      "x-auth-token": token, // Pass the token in the headers correctly
    },
  });
};


// CREATE Student User
const createStudent = (studentData) => {
    const token = getToken(); // Get token from Redux state or other source
  
    return httpClient.post("/users/student", studentData, {
      headers: {
        "x-auth-token": token, // Pass the token in the headers
        "Content-Type": "application/json", // Ensure JSON content type is set
      },
    });
  };


  
// DELETE Student User
const deleteStudent = (id) => {
  const token = getToken(); // Get token from Redux state or other source

  return httpClient.delete(`/users/deleteUser/${id}`, {
    headers: {
      "x-auth-token": token, // Pass the token in the headers
      "Content-Type": "application/json", // Ensure JSON content type is set
    },
  });
};

// Edit Volunteer
const editStudent = (id,data) => {
  console.log(data)
  const token = getToken(); // Get token from Redux state or other source
  return httpClient.put(`/users/update/${id}`,data, {
    headers: {
      "x-auth-token": token, // Pass the token in the headers
    },
  });
};


const geStudentById = (id) => {
  const token = getToken(); // Get token from Redux state or other source

  return httpClient.get(`/users/get/${id}`, {
    headers: {
      "x-auth-token": token, // Pass the token in the headers correctly
    },
  });
};





const exportedObject = {
    createStudent,
    getAllStudents,
    deleteStudent,
    editStudent,
    geStudentById,
    getAllFamilyNo
};



export default exportedObject;