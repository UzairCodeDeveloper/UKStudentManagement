import httpClient from "../../http-commons"

// Sign In
const signInAdmin = (credentials) => {
  return httpClient.post("/admin/login", credentials);
};



const exportedObject = {
    signInAdmin,
};



export default exportedObject;