import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchApiData = createAsyncThunk("api/fetchData", async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}api`);
  return response.data;
});
const initialState = {
  websiteSetup: null,
};


const apiSlice = createSlice({
  name: "api-data",
  initialState: {
    data: null,
  },
  reducers: {
    setupAction: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchApiData.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { setupAction } = apiSlice.actions;
export default apiSlice.reducer;
