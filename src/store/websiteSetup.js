import { createSlice } from "@reduxjs/toolkit";

const websiteSetup = createSlice({
  name: "websiteSetup",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    setupAction: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    // ... other reducers
  },
});

export const { setupAction } = websiteSetup.actions;
export default websiteSetup.reducer;
