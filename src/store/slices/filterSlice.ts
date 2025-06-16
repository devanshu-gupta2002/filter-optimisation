import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  [column: string]: string;
}

const initialState: FilterState = {};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    updateFilter(state, action: PayloadAction<{ column: string; value: string }>) {
      const { column, value } = action.payload;
      state[column] = value;
    },
    resetFilter(state, action: PayloadAction<string>) {
      delete state[action.payload];
    },
  },
});

export const { updateFilter, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;