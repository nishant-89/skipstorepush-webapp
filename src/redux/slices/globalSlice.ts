import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { GlobalState } from "src/utils/types/redux";

const initialState: GlobalState = {
  loading: false,
};

const globalSlice = createSlice({
  name: "globalSlice",
  initialState,
  reducers: {
    setLoading: (state: GlobalState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoading } = globalSlice.actions;

export default globalSlice.reducer;
