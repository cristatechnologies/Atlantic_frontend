import { configureStore } from "@reduxjs/toolkit";
import websiteSetup from "./websiteSetup";
import apiReducer from "./apiSlice";

const store = configureStore({
  reducer: {
    websiteSetup: websiteSetup,
    apiData: apiReducer,
  },
});

export default store;
