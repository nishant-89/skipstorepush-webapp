import { all } from "redux-saga/effects";
import watchAllApp from "src/containers/redux/sagas/allApp";
import watchAuthData from "src/containers/redux/sagas/auth";
import watchCollaborators from "src/containers/redux/sagas/collaborators";
import watchProfile from "src/containers/redux/sagas/profile";
import watchRelease from "src/containers/redux/sagas/release";

export default function* rootSaga() {
  yield all([
    watchAuthData(),
    watchProfile(),
    watchAllApp(),
    watchRelease(),
    watchCollaborators(),
  ]);
}
