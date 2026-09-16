import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ReleaseState, FetchReleaseStatePayload } from "../types";

const initialState: ReleaseState = {
  loading: true,
  filteredData: [],
  count: 0,
  error: null,
  page: 1,
  rowsPerPage: 10,
  isRefresh: false,
  envId: "",
};

const ReleaseList = createSlice({
  name: "Release",
  initialState,
  reducers: {
    fetchReleaseRequest(
      state,
      _action: PayloadAction<FetchReleaseStatePayload>
    ) {
      state.loading = true;
    },
    fetchReleaseSuccess(state, action) {
      state.loading = false;
      state.filteredData = action.payload.list;
      state.count = action.payload.total_items;
    },
    fetchReleaseFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    handleRefresh(state, action) {
      state.isRefresh = action.payload;
    },
    handleEnvironment(state, action) {
      state.envId = action.payload;
    },
    resetReleaseState(state) {
      return {
        ...initialState,
        envId: state.envId,
      };
    },
  },
});

export const {
  fetchReleaseRequest,
  fetchReleaseSuccess,
  fetchReleaseFailure,
  handleRefresh,
  resetReleaseState,
  handleEnvironment,
} = ReleaseList.actions;

export default ReleaseList.reducer;
