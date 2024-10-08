import { store } from '../Redux/store'; 

export const getToken = () => {
  const token = store.getState()?.user?.user?.token; // Access the token from the state

  if (!token) {
    throw new Error("Token not found!"); // Handle error if token is not available
  }

  return token;
};
