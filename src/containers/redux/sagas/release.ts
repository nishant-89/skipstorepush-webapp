import { call, put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchReleaseRequest,
  fetchReleaseSuccess,
  fetchReleaseFailure,
} from "../slices/release";

import { showAlert } from "src/utils/alert";

import { getDataApi } from "src/apis/api";
import { ReleaseResponse, FetchReleaseStatePayload } from "../types";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";

function* fetchReleaseSaga(action: PayloadAction<FetchReleaseStatePayload>) {
  try {
    const { type, search, page, limit, appId } = action.payload;

    let url = `${apiRoutes.Release}?limit=${limit}&appId=${appId}&page=${page}&sort_by=createdDate&order=DESC`;

    if (type) {
      url += `&appEnvironment=${type}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response: ReleaseResponse = yield call(getDataApi, {
      path: url,
    });

    yield put(
      fetchReleaseSuccess({
        list: response?.data?.list || [],
        total_items: response?.data?.total_items || 0,
      })
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showAlert(2, errorMessage ?? "Error fetching Data");
    yield put(fetchReleaseFailure((error as Error).message));
  }
}

export default function* watchRelease() {
  yield takeEvery(fetchReleaseRequest.type, fetchReleaseSaga);
}
