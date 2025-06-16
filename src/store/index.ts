import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";
import optionsReducer from "./slices/optionsSlice";
import dataReducer from "./slices/tableSlice";

const store = configureStore({
  reducer: {
    filters: filterReducer,
    options: optionsReducer,
    dataTable: dataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;