import { call, put, takeEvery } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchCollaboratorsRequest,
  fetchCollaboratorsSuccess,
  fetchCollaboratorsFailure,
} from "../slices/collaborators";

import { showAlert } from "src/utils/alert";

import { getDataApi } from "src/apis/api";
import {
  CollaboratorsResponse,
  FetchCollaboratorsStatePayload,
} from "../types";
import { apiRoutes, getErrorMessage } from "src/utils/common/constants";

function* fetchCollaboratorsSaga(
  action: PayloadAction<FetchCollaboratorsStatePayload>
) {
  try {
    const { page, limit, appId } = action.payload;

    let url = `${apiRoutes.Collaborators}?limit=${limit}&page=${page}&appId=${appId}`;

    const response: CollaboratorsResponse = yield call(getDataApi, {
      path: url,
    });

    yield put(
      fetchCollaboratorsSuccess({
        list: response?.data?.list || [],
        total_items: response?.data?.total_items || 0,
      })
    );
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showAlert(2, errorMessage ?? "Error fetching Data");
    yield put(fetchCollaboratorsFailure((error as Error).message));
  }
}

export default function* watchCollaborators() {
  yield takeEvery(fetchCollaboratorsRequest.type, fetchCollaboratorsSaga);
}
