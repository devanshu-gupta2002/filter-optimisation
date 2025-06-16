import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface DataRow {
  [key: string]: string;
}

interface DataTableState {
  rows: DataRow[];
}

const initialState: DataTableState = {
  rows: [],
};

const dataTableSlice = createSlice({
  name: "dataTable",
  initialState,
  reducers: {
    setRows(state, action: PayloadAction<DataRow[]>) {
      state.rows = action.payload;
    },
  },
});

export const { setRows } = dataTableSlice.actions;
export default dataTableSlice.reducer;
