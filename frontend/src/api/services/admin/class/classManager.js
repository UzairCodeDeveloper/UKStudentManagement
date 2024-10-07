import httpClient from "../../../http-commons"

// Sign In
const getAllClasses = () => {
  return httpClient.get("/class/all-classes");
};

const exportedObject = {
    getAllClasses,
};



export default exportedObject;