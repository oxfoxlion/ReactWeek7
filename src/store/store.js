import { configureStore } from "@reduxjs/toolkit";
import toastReducer from "../slices/toastSlice";

const store = configureStore({
    reducer:{
        toast:toastReducer
    }
})

export default store;