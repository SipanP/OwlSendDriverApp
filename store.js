import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./app/slices/navSlice";

export const store = configureStore({
  reducer: {
    nav: navReducer,
  },
});
