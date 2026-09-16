import { call, put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchAllAppRequest,
  fetchAllAppSuccess,
  fetchAllAppFailure,
} from "../slices/allApp";

import { showAlert } from "src/utils/alert";

import { getDataApi } from "src/apis/api";
import { AllAppResponse, FetchAllAppStatePayload } from "../types";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";

function* fetchAllAppSaga(action: PayloadAction<FetchAllAppStatePayload>) {
  try {
    const { type, search, page, limit } = action.payload;

    let url = `${apiRoutes.AllApp}?limit=${limit}&page=${page}&order=DESC`;

    if (type?.length > 0) {
      url += `&type=${type}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response: AllAppResponse = yield call(getDataApi, {
      path: url,
    });

    yield put(
      fetchAllAppSuccess({
        list: response?.data?.list || [],
        total_items: response?.data?.total_items || 0,
      })
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showAlert(2, errorMessage ?? "Error fetching Data");
    yield put(fetchAllAppFailure((error as Error).message));
  }
}

export default function* watchAllApp() {
  yield takeEvery(fetchAllAppRequest.type, fetchAllAppSaga);
}
