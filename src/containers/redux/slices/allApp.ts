import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AllAppState, FetchAllAppStatePayload } from "../types";

const initialState: AllAppState = {
  loading: false,
  filteredData: [],
  count: 0,
  error: null,
  page: 1,
  rowsPerPage: 10,
  isRefresh: false,
};

const allAppList = createSlice({
  name: "AllApp",
  initialState,
  reducers: {
    fetchAllAppRequest(state, _action: PayloadAction<FetchAllAppStatePayload>) {
      state.loading = true;
    },
    fetchAllAppSuccess(state, action) {
      state.loading = false;
      state.filteredData = action.payload.list;
      state.count = action.payload.total_items;
    },
    fetchAllAppFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    handleRefresh(state, action) {
      state.isRefresh = action.payload;
    },
  },
});

export const {
  fetchAllAppRequest,
  fetchAllAppSuccess,
  fetchAllAppFailure,
  handleRefresh,
} = allAppList.actions;

export default allAppList.reducer;
