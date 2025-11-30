import { configureStore } from "@reduxjs/toolkit";
import businessReducer from "./slices/businessSlice";
import clientReducer from "./slices/clientSlice";
import knowledgeReducer from "./slices/knowledgeSlice";
import paymentReducer from "./slices/paymentSlice";
import adminReducer from "./slices/adminSlice";
import dashboardReducer from "./slices/dashboardSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      business: businessReducer,
      client: clientReducer,
      knowledge: knowledgeReducer,
      payment: paymentReducer,
      admin: adminReducer,
      dashboard: dashboardReducer,
    },
  });
};

