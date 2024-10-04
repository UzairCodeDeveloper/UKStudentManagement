// src/slices/sidebarSlice.js

import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isVisible: true, // Default state of the sidebar (visible)
  },
  reducers: {
    toggleSidebar(state) {
      state.isVisible = !state.isVisible; // Toggle the sidebar visibility
    },
    showSidebar(state) {
      state.isVisible = true; // Show the sidebar
    },
    hideSidebar(state) {
      state.isVisible = false; // Hide the sidebar
    },
  },
});

// Export actions
export const { toggleSidebar, showSidebar, hideSidebar } = sidebarSlice.actions;

// Export the reducer
export default sidebarSlice.reducer;
