import { createSlice } from "@reduxjs/toolkit";

const userslice = createSlice({
  name: "user",

  initialState: {
    loggedIn: false,
    adminLogin: false,
    teacherLogin: false,
    studentLogin: false,
    familyLogin: false,
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
      state.teacherLogin = false;
      state.studentLogin = false;
    },
    setTeacherUser: (state, action) => {
      state.user = action.payload;
      state.loggedIn = true;
      state.teacherLogin = true;
      state.adminLogin = false;
      state.studentLogin = false;
    },
    setStudentUser: (state, action) => {
      state.user = action.payload;
      state.loggedIn = true;
      state.studentLogin = true;
      state.teacherLogin = false;
      state.adminLogin = false;
    },
    setFamilyUser: (state, action) => {
      state.user = action.payload;
      state.loggedIn = true;
      state.familyLogin = true;
      state.adminLogin = false;
      state.teacherLogin = false;
      state.studentLogin = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.loggedIn = false;
      state.adminLogin = false;
      state.teacherLogin = false;
      state.studentLogin = false;
      state.familyLogin = false;
    },
  },
});

export const { getuser, setUser, logoutUser, setAdminUser, setStudentUser, setTeacherUser, setFamilyUser } = userslice.actions;

export default userslice.reducer;
