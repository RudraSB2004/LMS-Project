import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import { authApi } from "../features/api/authApi";
import { purchaseApi } from "../features/api/purchaseApi";
import { courseApi } from "../features/api/courseApi";
import { courseProgressApi } from "../features/api/courseProgressApi";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [purchaseApi.reducerPath]: purchaseApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [courseProgressApi.reducerPath]: courseProgressApi.reducer,
  auth: authReducer,
});

export default rootReducer;
