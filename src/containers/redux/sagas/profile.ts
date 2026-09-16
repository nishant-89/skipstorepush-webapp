import { call, put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";

import {
  fetchProfileDataFailure,
  fetchProfileDataRequest,
  fetchProfileDataSuccess,
} from "../slices/profile";

import { getDataApi } from "src/apis/api";
import { ProfileResponse } from "../types";
import { apiRoutes } from "src/utils/common/constants";

function* fetchProfileDataSaga(_action: PayloadAction) {
  try {
    const response: ProfileResponse = yield call(getDataApi, {
      path: apiRoutes.Profile,
    });
    yield put(fetchProfileDataSuccess(response.data));
  } catch (error) {
    yield put(fetchProfileDataFailure((error as Error).message));
  }
}

export default function* watchProfile() {
  yield takeEvery(fetchProfileDataRequest.type, fetchProfileDataSaga);
}
