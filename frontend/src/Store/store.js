// src/store.js

import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from '../Store/sidebarSlice';

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer, // Add the sidebar reducer to the store
  },
});

export default store;
