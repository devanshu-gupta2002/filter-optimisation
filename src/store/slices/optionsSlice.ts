import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface OptionsState {
  [column: string]: string[];
}

const initialState: OptionsState = {};

const optionsSlice = createSlice({
  name: "columnOptions",
  initialState,
  reducers: {
    updateOptions(state, action: PayloadAction<{ column: string; values: string[] }>) {
      const { column, values } = action.payload;
      state[column] = values;
    },
  },
});

export const { updateOptions } = optionsSlice.actions;
export default optionsSlice.reducer;