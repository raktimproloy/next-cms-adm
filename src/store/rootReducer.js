import layout, { userSlice, updateInfoSlice, roleSlice, pageSlice, userRoleSlice, blogSlice } from "./layout";
import pageReducer from "./reducers/pageReducer"
import { combineReducers } from "@reduxjs/toolkit";

export default combineReducers({
  layout,
  users: userSlice.reducer,
  userRoles: userRoleSlice.reducer,
  roles: roleSlice.reducer,
  pages: pageSlice.reducer,
  update: updateInfoSlice.reducer,
  blogs: blogSlice.reducer,
  pageStore: pageReducer,
});