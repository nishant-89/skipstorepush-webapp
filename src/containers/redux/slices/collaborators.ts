import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CollaboratorsState, FetchCollaboratorsStatePayload } from "../types";

const initialState: CollaboratorsState = {
  loading: true,
  filteredData: [],
  count: 0,
  error: null,
  page: 1,
  rowsPerPage: 10,
  isRefresh: false,
};

const CollaboratorsList = createSlice({
  name: "Collaborators",
  initialState,
  reducers: {
    fetchCollaboratorsRequest(
      state,
      _action: PayloadAction<FetchCollaboratorsStatePayload>
    ) {
      state.loading = true;
    },
    fetchCollaboratorsSuccess(state, action) {
      state.loading = false;
      state.filteredData = action.payload.list;
      state.count = action.payload.total_items;
    },
    fetchCollaboratorsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    handleRefresh(state, action) {
      state.isRefresh = action.payload;
    },
    resetCollaboratorsState() {
      return initialState;
    },
  },
});

export const {
  fetchCollaboratorsRequest,
  fetchCollaboratorsSuccess,
  fetchCollaboratorsFailure,
  handleRefresh,
  resetCollaboratorsState,
} = CollaboratorsList.actions;

export default CollaboratorsList.reducer;
