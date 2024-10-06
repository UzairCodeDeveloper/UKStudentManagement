import { createSlice } from "@reduxjs/toolkit";

const userslice = createSlice({
  name: "user",

  initialState: {
    loggedIn: false,
    adminLogin: false,
    user: null, // Use "user" consistently
    token: null,
  },

  reducers: {
    getuser(state, action) {
      state.user = action.payload;
    },
    setAdminUser: (state, action) => {
      state.user = action.payload;
      state.loggedIn = true;
      state.adminLogin = true;
    },
    setUser: (state, action) => {
        state.user = action.payload;
        state.loggedIn = true;
        state.adminLogin = true;
      },
    logoutUser: (state) => {
      state.user = null;
      state.loggedIn = false;
      state.adminLogin = false;
    },
  },
});

export const { getuser, setUser, logoutUser , setAdminUser} = userslice.actions;
export default userslice.reducer;
