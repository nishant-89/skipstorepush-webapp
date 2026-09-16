import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile, ProfileDataState } from "../types";

const initialState: ProfileDataState = {
  loading: false,
  data: null,
  error: "",
};

const profileDataSlice = createSlice({
  name: "profileData",
  initialState,
  reducers: {
    fetchProfileDataRequest(state: ProfileDataState, _action: PayloadAction) {
      state.loading = true;
    },
    fetchProfileDataSuccess(
      state: ProfileDataState,
      action: PayloadAction<Profile>
    ) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchProfileDataFailure(
      state: ProfileDataState,
      action: PayloadAction<string>
    ) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchProfileDataRequest,
  fetchProfileDataFailure,
  fetchProfileDataSuccess,
} = profileDataSlice.actions;

// This is your custom logout action to reset the whole state

export default profileDataSlice.reducer;
