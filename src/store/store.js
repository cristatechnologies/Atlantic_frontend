import { configureStore } from "@reduxjs/toolkit";
import websiteSetup from "./websiteSetup";
import apiReducer from "./apiSlice";
import { authReducer } from "./auth-reducer";
const store = configureStore({
  reducer: {
    auth: authReducer,
    websiteSetup: websiteSetup,
    apiData: apiReducer,
  },
});

export default store;
