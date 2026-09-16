import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, UserData } from "../types";

const initialState: AuthState = {
  loading: false,
  accessToken: "",
  error: "",
  user: {} as UserData,
};

export interface AuthenticatePayload {
  code: string;
}

const authDataSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    fetchAuthenticateToken(
      state: AuthState,
      _action: PayloadAction<AuthenticatePayload>
    ) {
      state.loading = true;
    },
    fetchAuthenticateTokenSuccess(
      state: AuthState,
      action: PayloadAction<{ accessToken: string; user: UserData }>
    ) {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },
    fetchAuthenticateTokenFailure(
      state: AuthState,
      action: PayloadAction<string>
    ) {
      state.loading = false;
      state.error = action.payload;
    },
    resetAccessToken(state: AuthState) {
      state.accessToken = "";
    },
  },
});

export const {
  fetchAuthenticateToken,
  fetchAuthenticateTokenSuccess,
  fetchAuthenticateTokenFailure,
  resetAccessToken,
} = authDataSlice.actions;

export default authDataSlice.reducer;
