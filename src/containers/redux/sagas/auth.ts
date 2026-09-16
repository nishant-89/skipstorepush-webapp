import { call, put, takeEvery } from "redux-saga/effects";
import {
  fetchAuthenticateToken,
  fetchAuthenticateTokenSuccess,
  fetchAuthenticateTokenFailure,
  AuthenticatePayload,
} from "../../redux/slices/auth";
import { postDataApi } from "src/apis/api";
import { PayloadAction } from "@reduxjs/toolkit";
import { showAlert } from "src/utils/alert";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";
import { AuthData, AuthResponse } from "../types";
import { setLoading } from "src/redux/slices/globalSlice";

function* AuthenticateTokenSaga(action: PayloadAction<AuthenticatePayload>) {
  try {
    const response: AuthResponse = yield call(postDataApi, {
      path: apiRoutes.Login,
      data: {
        code: `${action.payload.code}`,
        state: "LXwYJRmod8FhID6DKAdFHaQW",
      },
    });

    const result: AuthData = response.data;

    yield put(setLoading(false));
    showAlert(1, response?.message);
    yield put(
      fetchAuthenticateTokenSuccess({
        accessToken: result.userAuthToken,
        user: result.userData,
      })
    );
  } catch (error) {
    yield put(setLoading(false));
    showAlert(2, getErrorMessage(error));
    yield put(fetchAuthenticateTokenFailure((error as Error).message));
  }
}

export default function* watchAuthData() {
  yield takeEvery(fetchAuthenticateToken.type, AuthenticateTokenSaga);
}
