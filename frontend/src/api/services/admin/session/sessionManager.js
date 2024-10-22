import httpClient from "../../../http-commons"; 
import { getToken } from '../../../../util/adminUtil'; 

const createSession = (data) => {
    const token = getToken(); 
    return httpClient.post("/session", data, {
      headers: {
        "x-auth-token": token,  
      },
    });
};

// GET: Fetch all sessions
const getAllSessions = () => {
    const token = getToken();   
    return httpClient.get("/session/get-sessions", {
      headers: {
        "x-auth-token": token,  
      },
    });
};

// GET: Fetch a session by ID
const getSessionById = (id) => {
    const token = getToken();  
    return httpClient.get(`/session/get-session/${id}`, {
      headers: {
        "x-auth-token": token,  
      },
    });
};

// PUT: Update a session by ID
const updateSession = (id, data) => {
    const token = getToken();  
    return httpClient.put(`/session/edit-session/${id}`, data, {
      headers: {
        "x-auth-token": token,  
      },
    });
};

// DELETE: Delete a session by ID
const deleteSession = (id) => {
    const token = getToken();  
    return httpClient.delete(`/session/delete/${id}`, {
      headers: {
        "x-auth-token": token,  
      },
    });
};

// Exporting all session-related API methods
const sessionApi = {
    createSession,
    getAllSessions,
    getSessionById,
    updateSession,
    deleteSession
};

export default sessionApi;
