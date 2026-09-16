import { combineReducers } from "redux";
import authReducer from "src/containers/redux/slices/auth";
import profileReducer from "src/containers/redux/slices/profile";
import allAppReducer from "src/containers/redux/slices/allApp";
import releaseReducer from "src/containers/redux/slices/release";
import collabratorsReducer from "src/containers/redux/slices/collaborators";
import { GlobalState } from "src/utils/types/redux";
import globalReducer from "src/redux/slices/globalSlice";
import { AuthState, ProfileDataState } from "src/containers/redux/types";

export type RootReducerType = {
  auth: AuthState;
  globalState: GlobalState;
  profile: ProfileDataState;
};

const rootReducer = combineReducers({
  auth: authReducer,
  globalState: globalReducer,
  profile: profileReducer,
  allApps: allAppReducer,
  release: releaseReducer,
  collabrators: collabratorsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
