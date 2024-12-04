import httpClient from "../../../http-commons"; 
import { getToken } from '../../../../util/adminUtil'; 



const getStudentRecord = (data) => {
    const token = getToken(); 
    return httpClient.post("/grading/grading",data, {
      headers: {
        "x-auth-token": token,  
      },
    });
  };


  const getRecords = (data) => {
    const token = getToken(); 
    return httpClient.post("/grading/fetchGrades",data, {
      headers: {
        "x-auth-token": token,  
      },
    });
  };



  const deleteRecord = (id) => {
    const token = getToken(); 
    // console.log(data)
    return httpClient.delete(`/grading/deletegrades/${id}`, {
      headers: {
        "x-auth-token": token,  
      },
    });
  };


  const submitGradingData = (data) => {
    const token = getToken(); // Function to retrieve the token (from localStorage, context, etc.)
  
    return httpClient.post("/grading/create-grading", data, {
      headers: {
        "x-auth-token": token, // Attach the token in the request header
      },
    });
  };
  

  
  const FeesApi={
   
    getStudentRecord,
    submitGradingData,
    getRecords,
    deleteRecord
}

export default FeesApi;