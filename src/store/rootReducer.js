import layout, { userSlice, updateInfoSlice, roleSlice, pageSlice, userRoleSlice } from "./layout";
import pageReducer from "./reducers/pageReducer"
import { combineReducers } from "@reduxjs/toolkit";

export default combineReducers({
  layout,
  users: userSlice.reducer,
  userRoles: userRoleSlice.reducer,
  roles: roleSlice.reducer,
  pages: pageSlice.reducer,
  update: updateInfoSlice.reducer,
  pageStore: pageReducer,
});